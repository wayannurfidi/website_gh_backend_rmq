const amqp = require ("amqplib")
const msq = {Temp:10, TempF:12}
async function connect(){

    try {
        const connection = await amqp.connect('amqp://ubliot:qwerty1245@cloudrmqserver.pptik.id//mahasiswaubl')
        const channel = await connection.createChannel ()

        let i = 1
        while (true){
            let suhu={
                TempC:Math.floor(Math.random()*100),
                TempF:Math.floor(Math.random()*100)
            }
            console.log(suhu)
            channel.sendToQueue("sensork4",Buffer.from(JSON.stringify(suhu)))
            i++
            if(i>=50){
                break
            }
        }
        console.log("Pesan Terkirim", i)

    } catch (error){
        console.log(error)

    }
    
}
setInterval(connect,3000)