import * as SQLite from 'expo-sqlite'

export const DEFAULT_DB_NAME = "temp.db"
export const TEST_DB_NAME = "test.db";

export function dropDatabase(dbName: string){
    let db = SQLite.openDatabase(dbName)
    db.transaction(tx => {
        tx.executeSql("DROP TABLE history;")
    })
}

export async function openDatabase(name: string){
    let db = SQLite.openDatabase(`${name}`)
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

export async function updateDatabase(dbName: string){
    let db = await openDatabase(dbName)
    db.transaction(tx => {
        tx.executeSql("ALTER TABLE history DROP endDate;")
        tx.executeSql("ALTER TABLE history ADD duration INTEGER;")
    })
}


export async function insertHistory(dbName: string, startDate: Date, durationInSeconds: number){
    let db = await openDatabase(dbName)
    // console.log(db)
    db.transaction(tx => {
        tx.executeSql(`INSERT INTO history (startDate, duration) VALUES (?, ?)`, [JSON.stringify(startDate), durationInSeconds])

    }, (err) => {
        console.error("Error inserting", err)
    }, () => {
        console.log("Inserted values", startDate, durationInSeconds)
    })   
}

export async function readHistory(dbName: string): Promise<any[]>{
    let db = await openDatabase(dbName)
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
