use New_Database;

db.createCollection("New Collection", {
    "capped": false,
    "validator": {
        "$jsonSchema": {
            "bsonType": "object",
            "title": "New Collection",
            "properties": {
                "_id": {
                    "bsonType": "objectId"
                },
                "New Field": {
                    "bsonType": "string"
                },
                "New Field1": {
                    "bsonType": "string"
                },
                "New Field2": {
                    "bsonType": "string"
                }
            },
            "additionalProperties": false
        }
    },
    "validationLevel": "off",
    "validationAction": "warn"
});