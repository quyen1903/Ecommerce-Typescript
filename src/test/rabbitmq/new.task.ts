import amqp from 'amqplib/callback_api';


amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'task_queue';
        var msg = process.argv.slice(2).join(' ') || "Hello World!";

    //set durable to true to make sure rabbitmq survive a rabbitmq node restart.
    //we need to set durable to true in both producer and receiver
        channel.assertQueue(queue, {
            durable: true
        });
        channel.sendToQueue(queue, Buffer.from(msg), {
            persistent: true
        });
        console.log(" [x] Sent '%s'", msg);
    });
        setTimeout(function() {
            connection.close();
            process.exit(0)
        }, 500);
  });