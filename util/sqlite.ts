import * as SQLite from 'expo-sqlite'

// async function openDatabase(pathToDatabaseFile: string): Promise<SQLite.WebSQLDatabase> {
//     if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
//       await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
//     }
//     await FileSystem.downloadAsync(
//       Asset.fromModule(require(pathToDatabaseFile)).uri,
//       FileSystem.documentDirectory + 'SQLite/myDatabaseName.db'
//     );
//     return SQLite.openDatabase('myDatabaseName.db');
//   }

export function dropDatabase(){
    let db = SQLite.openDatabase("temp.db")
    db.transaction(tx => {
        tx.executeSql("DROP TABLE history;")
    })
}

export async function openDatabase(){
    let db = SQLite.openDatabase("temp.db")
    return new Promise<SQLite.WebSQLDatabase>(resolve => {
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                startDate DATETIME,
                duration INTEGER
                );`, [], (tx, rows) => {
                    // Success callback
                }, (tx, err) => {
                    console.error("Error in creating table", err)
                    return false;
            })
        }) 
        resolve(db)
    })
}

/* History Table
id: number
date: date
*/

interface History {
    date: Date
}

/* Future Use Case: 
1. Times are customisable.
- Would need the start and end date to measure time spent


*/

export async function updateDatabase(){
    let db = await openDatabase()
    db.transaction(tx => {
        tx.executeSql("ALTER TABLE history DROP endDate;")
        tx.executeSql("ALTER TABLE history ADD duration INTEGER;")
    })
}


export async function insertHistory(startDate: Date, duration: number){
    let db = await openDatabase()

    db.transaction(tx => {
        tx.executeSql(`INSERT INTO history (startDate, duration) VALUES (?, ?)`, [JSON.stringify(startDate), duration])

    }, (err) => {
        console.error("Error inserting", err)
    }, () => {
        console.log("Inserted values", startDate, duration)
    })   
}

export async function readHistory(): Promise<any[]>{
    let db = await openDatabase()
    return new Promise(resolve => {
        let results: any[] = []
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM history;`, 
                [], 
                (_, {rows: {_array}}) => {
                    
                    results = _array
                }
            )}, 
            (err) => {
                console.error(err)
            },
            () => { // SUCCESS CALLBACK
                return resolve(results)
            }
        )
    })

}