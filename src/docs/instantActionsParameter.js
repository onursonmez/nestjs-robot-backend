/* YENI INSTANT ACTION EKLEME

headerId: arkaplanda auto increment integer
timestamp: arkaplanda otomatik olarak olusturulur
version: serialNumber ile bulunan robottan alınan bilgi
manufacturer: serialNumber ile bulunan robottan alınan bilgi
serialNumber: serialNumber ile bulunan robottan alınan bilgi

Action Type (dropdown)
(robot.factsheet.agvActions.actionScopes includes 'INSTANT' olan robot.factsheet.agvActions.actionType listesinden seçilir)
Örnek: MOVE
(Seçildiğinde ilgili description alanı bilgi amaçlı drawerın bir köşesinde gözüksün)

Blocking Type (dropdown)
(Seçilen action type'ın blocking typesları listelenir)
Örnek: HARD

Oluşturulan tüm instant actionlar instantActions tablosunda saklansın.

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