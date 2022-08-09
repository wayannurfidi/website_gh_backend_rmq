const router = require('express').Router()
var q = 'sensork4';
const { type } = require('express/lib/response');
const mongo=require('mongoose')
const db = mongo.connection
koneksiRmq()

function koneksiRmq() {
    require('amqplib/callback_api').connect({protocol:'amqp',hostname:'rmq2.pptik.id',port:'5672',username:'ubliot',
    password:'qwerty1245',vhost:'/mahasiswaubl'},function (err,conn) {
       try {
           if (err) {
                console.log("Tidak Ada Koneksi Jaringan")  
                reconnect();
           }else{
               console.log("Terhubung Ke RMQ")
               consumer(conn);
           }
       } catch (e) {
           console.log("Terjadi Kesalahan Di RMQ")
       } 
    });
}

function consumer(conn) {
    try {
        var sukses = conn.createChannel(on_open);
        function on_open(err, ch) {
            ch.consume(q,(msg)=>{
                if (msg ==null) {
                    console.log("Pesan Tidak Ada")
                }else{
                    console.log(msg.content.toString());
                    console.log("pesan dapat")
                    ch.ack(msg);
                    //funsi sebagai argumen kedua yang dapat merubah nilai objek, dimana nilai objeknya itu nilai suhu dan keterangan
                    var json = msg.content.toString();
                    const obj = JSON.parse(json);
                    var ADC=(obj.ADC);
                    var KET=(obj.KET);
                    const History={ADC:ADC, KET:KET }
                    
                    try {
                        Save(History)
                    } catch (e) {
                        console.log("Error")
                    }
                }
                //  const data =(msg.content.toString())
                //  const tipe = JSON.parse(JSON.stringify(data))
                //  console.log(tipe)
            });
        }
    } catch (e) {
        console.log("Error")
    }
}

function Save(History) {
    koneksi()
    try {
        db.collection("sensork4").insertOne(History,function(err){
            if (err) {
                console.log("Gagal")
            }else{
                console.log("Berhasil Menyimpan Data ke Database")
            }
        })
    } catch (e) {
        console.log(e)
    }
}

function koneksi() {
    mongo.connect('mongodb://127.0.0.1:27017/Greenhouse',{
        
    })
    try {
        db.once('open',()=> console.log("Berhasil Terhubung Ke Database"))
    } catch (e) {
        db.on('error',error =>console.log(error))
        console.log(console.error)
    }
}

function reconnect(){
    console.log("Menghubungkan Ulang Ke RMQ")
    koneksiRmq(setInterval, 1000);
}

module.exports=({ router, koneksi })