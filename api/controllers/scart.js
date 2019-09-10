'use strict';
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1',
    keyspace: 'scart'
});

var util = require('util');


module.exports = {
    vendorLogin,
    userLogin
   
};

function vendorLogin(req, res) {

    var responseVendorLogin = {};
    var id = req.body.id;
    var password = req.body.password;
    var cat;
    var name;

    function checkLogin() {
        return new Promise((resolve, reject) => {
            var checkLoginQuery = "select pwd from vendorlogin where id = '" + id + "'";
            client.execute(checkLoginQuery)
                .then(ramu => {
                    console.log("ramu->" + JSON.stringify(ramu));
                    if (ramu.rowLength < 1) {
                        reject("user not registered");
                    } else {
                        var pwdTemp = ramu.rows[0].pwd;
                        if (password == pwdTemp) {
                            resolve();
                        } else {
                            reject("Invalid password");
                        }

                    }

                })
                .catch(err => {
                    console.log("Error in checking login" + err);
                    reject("Error in checking for login")

                })

        })

    }

    function getProducts() {
        return new Promise((resolve, reject) => {
            var getCategoriesQuery = "select name,categories from vendor where id = '"+id+"'";
            client.execute(getCategoriesQuery)
            .then(dolly =>{
                if(dolly.rowLength<1){
                    reject("no categories, add some");
                }
                else{
                   cat = dolly.rows[0].categories;  
                   name = dolly.rows[0].name;
                   resolve();
                }

            })
            .catch(err => {
                console.log("Error in getting Categories");
                reject("error in getting categories");
            })

        })
    }

    function sendResponse() {
        return new Promise((resolve, reject) => {
            responseVendorLogin.categories = cat;
            responseVendorLogin.name = name;
            responseVendorLogin.message = "success";
            res.json(responseVendorLogin);
            resolve();

        })
    }

    checkLogin()
        .then(getProducts)
        .then(sendResponse)
        .catch(err => {
            console.log("error in vendorlogin" + err);
            responseVendorLogin.message = err;
            res.json(responseVendorLogin);
        })



}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function userLogin(req, res) {

    var responseUserLogin = {};
    var id = req.body.id;
    var password = req.body.password;
    var address;
    var name;

    function checkMandatoryFields() {
        return new Promise((resolve, reject) => {
console.log("id->"+ id);
console.log("password->"+ password);
if(id==undefined || id=='undefined' || password==undefined || password=='undefined'){
reject("Please send ID/Password, Dude!")
}
else{
reject();
}

        })
    }

    function checkLogin() {
        return new Promise((resolve, reject) => {
            var checkLoginQuery = "select password from userlogin where id = '" + id + "'";
            client.execute(checkLoginQuery)
                .then(ramu => {
                    console.log("ramu->" + JSON.stringify(ramu));
                    if (ramu.rowLength < 1) {
                        reject("user not registered");
                    } else {
                        var pwdTemp = ramu.rows[0].password;
                        if (password == pwdTemp) {
                            resolve();
                        } else {
                            reject("Invalid password");
                        }

                    }

                })
                .catch(err => {
                    console.log("Error in checking login" + err);
                    reject("Error in checking for login")

                })

        })

    }

    function getProducts() {
        return new Promise((resolve, reject) => {
            var getCategoriesQuery = "select name,address from user where id = '"+id+"'";
            client.execute(getCategoriesQuery)
            .then(dolly =>{
                if(dolly.rowLength<1){
                    reject("no address found, add some");
                }
                else{
                   address = dolly.rows[0].address;  
                   name = dolly.rows[0].name;
                   resolve();
                }

            })
            .catch(err => {
                console.log("Error in getting Categories");
                reject("error in getting categories");
            })

        })
    }

    function sendResponse() {
        return new Promise((resolve, reject) => {
            responseUserLogin.address = address;
            responseUserLogin.name = name;
            responseUserLogin.message = "success";
            res.json(responseUserLogin);
            resolve();

        })
    }
    checkMandatoryFields()
    .then(checkLogin)
        .then(getProducts)
        .then(sendResponse)
        .catch(err => {
            console.log("error in userlogin" + err);
            responseUserLogin.message = err;
            res.json(responseUserLogin);
        })



}



