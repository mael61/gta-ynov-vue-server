"use strict";
const sqlite3 = require('sqlite3').verbose();

class Db {
    constructor(file) {
        this.db = new sqlite3.Database(file);
        this.createTableUser();
        this.createTableProfile();
        this.createTableCalendarEvent();
        this.createTableContrat();
        this.createTableMeter();
    }

    createTableUser() {
        const sql = `
            CREATE TABLE IF NOT EXISTS user (
                id integer PRIMARY KEY, 
                name text, 
                email text UNIQUE, 
                user_pass text,
                role text)`
        return this.db.run(sql);
    }

    createTableProfile(){
        const sql = `CREATE TABLE IF NOT EXISTS userProfile(
                      id integer PRIMARY KEY,
                      userId integer,
                      surname text,
                      name text,
                      birth text,
                      tel integer,
                      address text)`
        return this.db.run(sql);
    }

    createTableCalendarEvent(){
        const sql = `CREATE TABLE IF NOT EXISTS calendarEvent(
                      id integer PRIMARY KEY,
                      userId  integer,
                      dateBegin text,
                      dateEnd text,
                      category text,
                      reason text)`
        return this.db.run(sql);
    }
    insertEvent(event) {
        return this.db.run(
            'INSERT INTO calendarEvent (userId,dateBegin,dateEnd, category, reason) VALUES (?,?,?,?,?)',
            event)
    }

    selectPlanningById(userId,callback){
        return this.db.all(
            `SELECT * FROM calendarEvent WHERE userId = ? `,
            [userId],function(err,row) {
                callback(err, row)
            })
    }

    createTableContrat(){
        const sql= `CREATE TABLE IF NOT EXISTS contrat(
                      id integer PRIMARY KEY,
                      userId integer,
                      dateBegin text,
                      dateEnd text,
                      hoursWeekly integer,
                      Etp integer,
                      category text)`
        return this.db.run(sql);

    }

    createTableMeter(){
        const sql=`CREATE TABLE IF NOT EXISTS meter(
                    id integer PRIMARY KEY,
                    userId integer,
                    wordkedDay integer,
                    holiday integer,
                    absence integer)`
        return this.db.run(sql);
    }

    selectProfileById(userId,callback){
        return this.db.get(
            `SELECT * FROM userProfile WHERE userId = ? `,
            [userId],function(err,row){
                callback(err,row)
            })

    }
    selectByEmail(email, callback) {
        return this.db.get(
            `SELECT * FROM user WHERE email = ?`,
            [email],function(err,row){
                callback(err,row)
            })
    }

    selectAll(callback) {
        return this.db.all(`SELECT * FROM user`, function(err,rows){
            callback(err,rows)
        })
    }

    insert(user, callback) {
        return this.db.run(
            'INSERT INTO user (name,email,user_pass, role) VALUES (?,?,?,?)',
            user, (err) => {
                callback(err)
            })
    }


}

module.exports = Db
