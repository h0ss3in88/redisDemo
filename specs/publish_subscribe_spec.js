import should from "should";
import {createClient} from "redis";
import {config} from "dotenv";

after(async () => {
    let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
    await client.connect();
    await client.flushDb();
    await client.disconnect();
});
describe('Redis Publish Subscribe Feature', function () {
    config();
    it('publish simple string message', async () => {
        try {
            let clientOne = createClient({ url : process.env.REDIS_CONNECTION, database: 2});
            await clientOne.connect();
            let  clientTwo = clientOne.duplicate();
            await clientTwo.connect();
    
            await clientTwo.subscribe('Redis:Test:Channel', (message) => {
                console.log(message);
                should(message).be.eql('Hello From Client One');
            });

            await clientOne.publish('Redis:Test:Channel', 'Hello From Client One');

            await clientOne.disconnect();
            await clientTwo.disconnect();
        }catch(error) {
            should.not.exist(error);
        }

    });
    it('Publish Json Object Message', async () => {
        try {
            let clientOne = createClient({ url : process.env.REDIS_CONNECTION, database: 2});
            await clientOne.connect();
            let  clientTwo =clientOne.duplicate();
            await clientTwo.connect();
    
            await clientTwo.subscribe('Redis:Test:Channel', (message) => {
                console.log(message);
                const user = JSON.parse(message);
                should(user['first_name']).be.eql('Test First Name');
            });
            const testUser = {
                first_name: 'Test First Name',
                last_name: 'test Last Name',
                age : 12,
                email: 'test@test.com'
            };

            await clientOne.publish('Redis:Test:Channel', JSON.stringify(testUser));

            await clientOne.disconnect();
            await clientTwo.disconnect();
        }catch(error) {
            should.not.exist(error);
        }
    });
});