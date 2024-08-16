import { createClient, RedisClientType } from 'redis';

class RedisPubSubService {
    private subscriber!: RedisClientType;
    private publisher!: RedisClientType;
    private isInitialized = false;
    private initializationPromise: Promise<void>;
    private redisString = {
        password: process.env.REDIS_PASSWORD as string,
        socket: {
            host: process.env.REDIS_HOST as string,
            port: 16457
        }
    };

    constructor() {
        this.initializationPromise = this.initializeClients();
    }

    private async initializeClients() {
        const baseClient: RedisClientType = createClient(this.redisString);

        // init base client and duplicate subscriber, publisher from base client
        await baseClient.connect();

        this.subscriber = baseClient.duplicate();
        this.publisher = baseClient.duplicate();

        await this.connectClient(this.subscriber);
        await this.connectClient(this.publisher);

        //this line of code make sure we invoke  publish and subscribe after we successfully init a client
        this.isInitialized = true;
        console.log('Redis clients initialized');
    }

    private async connectClient(client: RedisClientType) {
        await client.connect();
        await this.pingClient(client);
        console.log('Redis client connected');
    }

    private async pingClient(client: RedisClientType) {
        await client.ping();
    }

    private async ensureInitialized() {
        await this.initializationPromise;
        if (!this.isInitialized) {
            throw new Error('Redis clients not initialized');
        }
    }

    async publish(channel: string, message: string) {
        await this.ensureInitialized();
        await this.publisher.publish(channel, message);
    }

    async subscribe(channel: string, callback: (message: string, channel: string) => void) {
        await this.ensureInitialized();
        const listener = (message: string, channel: string) => {
            console.log(message, channel);
            callback(message, channel);
        };

        await this.subscriber.subscribe(channel, listener);
    }
}

const redisPubSubService = new RedisPubSubService();

export default redisPubSubService;
