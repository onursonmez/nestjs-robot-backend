/* YENI INSTANT ACTION EKLEME

headerId: arkaplanda auto increment integer
timestamp: arkaplanda otomatik olarak olusturulur
version: serialNumber ile bulunan robottan alınan bilgi
manufacturer: serialNumber ile bulunan robottan alınan bilgi
serialNumber: serialNumber ile bulunan robottan alınan bilgi

Action Type (dropdown)
(robot.factsheet.protocolFeatures.agvActions.actionScopes includes 'INSTANT' olan robot.factsheet.protocolFeatures.agvActions.actionType listesinden seçilir)
Örnek: MOVE
(Seçildiğinde ilgili description alanı bilgi amaçlı drawerın bir köşesinde gözüksün)

Blocking Type (dropdown)
(Seçilen action type'ın blocking typesları listelenir)
Örnek: HARD

Oluşturulan tüm instant actionlar instantActions tablosunda saklansın.

--------------------
Node ve Edge action sayfası

1. bileşene data prop'u gönderilir. data prop'unun altında node yer almaktadır. data.node değişkeni node değişkenine atanır.
2. node değikeninin nodeActions dizisi (node.nodeActions) currentActions ve updatedActions değişkenine atanır.
3. useRobots() ile gelen robots değişkeni robotların dizisini tutar. Dizideki her bir robot, robot.type._id'e göre filtrelenerek tekilleştirilir ve tekilleştirilen robotlarda robot.factsheet.protocolFeatures.agvActions.actionScopes includes NODE içeren robotlar uniqueRobots değişkenine atanır.
4. uniqueRobots dizisinin her bir robot.factsheet.protocolFeatures.agvActions newActions değişkenine atanır.
4. currenctActions değişkeni div#currentActions kısmında loop edilerek div#currentAction formatında oluşturulur. <Move size={12} color="white" /> basılı tutulduğunda diğerleri ile sırası değiştirilebilir. <X size={16} color="white" /> tıklanıldığında listeden kaldırılır. sıralama ve silme islemleri updatedActions değişkenine uygulanır.     
5. Bir actiona tıklanıldığında tbody#actionParameters altına o actiona ait actionParameters dizisi tr etiketi içinde iki td olacak şekilde ilk td parameter.key, ikincisine input ve içine varsa parameter.value yerleştirilerek gösterilir. 
6. newActions değişkeni loop edilerek <Plus size={16} color="white" /> onClick olduğunda altında bir dropdown olarak açılır ve text newActions.actionType bilgisi yazılır. Dropdown üzerinde action'a tıklanıldığında div#currenctActions'a yeni eleman olarak eklenir ve kendisine tıklanıldığında diğerlerindeki gibi parametreleri değiştirilebilir.

NOTLAR:
1. Yeni eklenen action yapısı node.nodeActions dizisindeki bir action'un yapısında olacak. Ekleme yapılırken actionId olarak unique bir UUID atanacak. 
2. save() metodu tetiklendiğinde updatedActions değişkenindeki actionlar node.nodeActions'a save currentActions'lara atanacak.
3. robot.factsheet.protocolFeatures.agvActions içindeki her bir actionParameters altında isOptional parametresi var. Bir action eklenmiş ve parametresi isOptional false olan bir parametresi varsa ve boş bırılmışsa save işlemi gerçekleşmeyecek. İlgili action trigger click olarak ilgili parametreye focus olunacak.

örnek robot.factsheet içeriği

{
"factsheet": {
  "protocolFeatures": {
      "agvActions": [
        {
          "actionType": "PICK",
          "actionDescription": "Pick up a load",
          "actionScopes": [
            "NODE"
          ],
          "actionParameters": [
            {
              "key": "loadId",
              "valueDataType": "STRING",
              "description": "ID of the load to pick",
              "isOptional": false
            }
          ],
          "resultDescription": "Load successfully picked",
          "blockingTypes": [
            "SOFT",
            "HARD"
          ]
        },
        {
          "actionType": "DROP",
          "actionDescription": "Pick up a load",
          "actionScopes": [
            "NODE",
            "INSTANT"
          ],
          "actionParameters": [
            {
              "key": "loadId",
              "valueDataType": "INTEGER",
              "description": "ID of the load to drop",
              "isOptional": true
            },
            {
              "key": "loadName",
              "valueDataType": "STRING",
              "description": "Name of the load to drop",
              "isOptional": false
            }
          ],
          "resultDescription": "Load successfully picked",
          "blockingTypes": [
            "SOFT",
            "HARD",
            "NONE"
          ]
        }
      ]
    }
  }
}

örnek node içeriği

{
  "nodeId": "node1",
  "released": false,
  "stationType": "charging",
  "serialNumber": "SN123456",
  "nodePosition": {
    "x": -0.5,
    "y": 1,
    "allowedDeviationXY": 0.5,
    "allowedDeviationTheta": 0.1,
    "mapId": "map123"
  },
  "nodeActions": [
    {
      "robotType": "TypeA",
      "actions": [
        {
          "actionId": "action1",
          "actionType": "move",
          "actionDescription": "Move to position",
          "actionParameters": [
            {
              "key": "speed",
              "value": 1.5
            }
          ],
          "resultDescription": "Reached position",
          "blockingType": "SOFT"
        }
      ]
    }
  ]
}
*/
{
    "headerId": 1,
    "timestamp": "2024-12-10T10:30:00.00Z",
    "version": "1.3.2",
    "manufacturer": "AGV Manufacturing Inc.",
    "serialNumber": "SN123456789",
    "actions": [
        {
            "actionId": "action-1234-5678",
            "actionType": "move",
            "actionDescription": "Move the AGV forward 10 meters.",
            "blockingType": "NONE",
            "actionParameters": [
                {
                    "key": "duration",
                    "value": 10
                },
                {
                    "key": "direction",
                    "value": "forward"
                }
            ]
        },
        {
            "actionId": "action-2345-6789",
            "actionType": "pick",
            "actionDescription": "Pick up the load.",
            "blockingType": "HARD",
            "actionParameters": [
                {
                    "key": "deviceId",
                    "value": "device-001"
                },
                {
                    "key": "loadId",
                    "value": "load-5678"
                }
            ]
        },
        {
            "actionId": "action-3456-7890",
            "actionType": "signal",
            "actionDescription": "Send a signal to indicate readiness.",
            "blockingType": "SOFT",
            "actionParameters": [
                {
                    "key": "signal",
                    "value": "ready"
                }
            ]
        }
    ],
    "subtopic": "/instantActions"
}