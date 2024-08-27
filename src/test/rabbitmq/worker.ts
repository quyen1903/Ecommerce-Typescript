import amqp from 'amqplib/callback_api'

//we are implementing work queue, that will used to contribute time-consuming tasks among multiple worker
//Idea is to avoid execute resource-intensive task immediately, but we have to wait for it to complete.
//by default rabbitmq send each message to the next consumer, on average, every consumer get same number of message
//this is round-robin algorithm
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'task_queue';
    
        //set durable to true to make sure rabbitmq survive a rabbitmq node restart.
        //we need to set durable to true in both producer and receiver
        channel.assertQueue(queue, {
            durable: true
        });
        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg) {
            var secs = msg!.content.toString().split('.').length - 1;
    
            console.log(" [x] Received %s", msg!.content.toString());
            setTimeout(function() {
                console.log(" [x] Done");
                channel.ack(msg!);
            }, secs * 1000);
        }, {
        // manual acknowledgment mode, if message is failed to send, it will resend message
        noAck: false
            });
        });
    });