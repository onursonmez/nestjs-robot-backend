import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Carrier } from '../schemas/carrier.schema';
import { CreateCarrierDto } from '../dto/create-carrier.dto';
import { UpdateCarrierDto } from '../dto/update-carrier.dto';
import { exec } from 'child_process';

@Injectable()
export class CarrierService {
  private mosquittoPasswordFile = '/etc/mosquitto/passwordfile';
  constructor(
    @InjectModel(Carrier.name) private carrierModel: Model<Carrier>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findAll(): Promise<Carrier[]> {
    return this.carrierModel
      .find()
      .populate('type')
      .exec();
  }

  async findOne(id: string): Promise<Carrier | null> {
    return this.carrierModel
      .findById(id)
      .populate('type')
      .exec();
  }

  async create(createCarrierDto: CreateCarrierDto): Promise<Carrier> {
    const session = await this.connection.startSession(); // Transaction başlat
    session.startTransaction();

    try {
      // İlk işlem: Carrier'u oluştur ve kaydet
      const createdCarrier = new this.carrierModel(createCarrierDto);
      await createdCarrier.populate('type');
      const savedCarrier = await createdCarrier.save({ session });

      // İşlem başarılı, transaction'ı commit et
      await session.commitTransaction();
      session.endSession();

      return savedCarrier;
    } catch (error) {
      // Hata durumunda transaction'ı geri al
      await session.abortTransaction();
      session.endSession();
      throw new InternalServerErrorException('Hata oluştu: ' + error.message);
    }
  }

  async update(id: string, updateCarrierDto: UpdateCarrierDto): Promise<Carrier | null> {
    return this.carrierModel
      .findByIdAndUpdate(id, updateCarrierDto, { new: true })
      .populate('type')
      .exec();
  }

  async delete(id: string): Promise<Carrier | null> {
    return this.carrierModel.findByIdAndDelete(id).exec();
  }

  addMosquittoUser(username: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const command = `mosquitto_passwd -b ${this.mosquittoPasswordFile} ${username} ${password}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          return reject(stderr || error.message);
        }
        resolve(`Mosquitto user "${username}" added successfully.`);
      });
    });
  }

  updateMosquittoUser(username: string, newPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const command = `mosquitto_passwd -b ${this.mosquittoPasswordFile} ${username} ${newPassword}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          return reject(stderr || error.message);
        }
        resolve(`Mosquitto user "${username}" updated successfully.`);
      });
    });
  }

  deleteMosquittoUser(username: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const command = `sed -i '/^${username}:/d' ${this.mosquittoPasswordFile}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          return reject(stderr || error.message);
        }
        resolve(`User "${username}" deleted successfully.`);
      });
    });
  }
}