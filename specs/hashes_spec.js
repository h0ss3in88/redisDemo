import should from "should";
import {createClient} from "redis";
import {config} from "dotenv";

after(async () => {
    let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
    await client.connect();
    await client.flushDb();
    await client.disconnect();
});
describe.only('Redis Hashes Commands ', function () {
    config();
    it('set a hash', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect();
            let object = {'first': 'test', 'last': 'tets', 'age': 15 , 'email': 'test@test.com' , 'password': 'x@tetscaf'};
            let hSetResult = await client.hSet('hash:1', object);
            let hGetAllResult = await client.hGetAll('hash:1');
            console.log(hSetResult);
            await client.disconnect();
            should(hSetResult).is.exactly(Object.keys(object).length);
            should(hGetAllResult).be.not.null().has.properties(['first','last','age','email','password']);
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('del a hash', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let delResult = await client.del('hash:1');
            await client.disconnect();
            console.log(delResult);
            should(delResult).be.not.null().and.eql(1); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('hash incrBy with specific amount ', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let hSetResult = await client.hSet('hash:2', { 'number' : 2 });
            let incrResult = await client.hIncrBy('hash:2', 'number', 10);
            let hGetResult = await client.hGet('hash:2', 'number');
            await client.disconnect();
            console.log(hSetResult);
            console.log(incrResult);
            console.log(hGetResult);
            should(hSetResult).be.not.null().and.eql(1); 
            should(incrResult).be.not.null().and.eql(12); 
            should(parseInt(hGetResult, 10)).is.exactly(12);
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('exists a field in hash dataset', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let hExistsResult = await client.hExists('hash:2', 'number');
            let h2ExistsResult = await client.hExists('hash:3', 'number');
            await client.disconnect();
            console.log(hExistsResult);
            should(hExistsResult).be.not.null().and.eql(true); 
            should(h2ExistsResult).be.not.null().and.eql(false); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('delete a field in hash dataset', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            const object = { 'first_name' : 'test', 'last_name': 'test', 'extra' : 'true'};
            let hSetResult = await client.hSet('hash:4', object);
            let hDelResult = await client.hDel('hash:4', 'extra');
            await client.disconnect();
            console.log(hSetResult);
            console.log(hDelResult);
            should(hSetResult).be.not.null().and.eql(3); 
            should(hDelResult).be.not.null().and.eql(1); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('get all fields in hash dataset', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            const object = { 'first_name' : 'test', 'last_name': 'test', 'extra' : 'true'};
            let hSetResult = await client.hSet('hash:5', object);
            let hGetAllResult = await client.hGetAll('hash:5');
            await client.disconnect();
            console.log(hSetResult);
            should(hSetResult).be.not.null().and.eql(3); 
            should(Object.keys(hGetAllResult)).be.not.null().and.eql(Object.keys(object)); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('get a field from hash dataset', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            const object = { 'first_name' : 'test', 'last_name': 'test', 'extra' : 'true'};
            let hSetResult = await client.hSet('hash:6', object);
            let hGetResult = await client.hGet('hash:6', 'first_name');
            await client.disconnect();
            console.log(hSetResult);
            console.log(hGetResult);
            should(hSetResult).be.not.null().and.eql(3); 
            should(hGetResult).be.not.null().and.eql('test'); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('get number of fields in hash dataset', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let hLenResult = await client.hLen('hash:6');
            await client.disconnect();
            console.log(hLenResult);
            should(hLenResult).be.not.null().and.eql(3); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('set a key if does\'nt have value ', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            const object = { 'first_name' : 'test', 'last_name': 'test', 'extra' : 'true'};
            let hSetResult = await client.hSetNX('hash:6', 'first_name', 'tom');
            await client.disconnect();
            console.log(hSetResult);
            should(hSetResult).be.not.null().and.eql(false); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('get all keys name from hash dataset', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let hKeysResult= await client.hKeys('hash:6');
            await client.disconnect();
            console.log(hKeysResult);
            should(hKeysResult).be.not.null().and.containEql('first_name', 'last_name', 'extra'); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('get all values from hash dataset', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let hValuesResult= await client.hVals('hash:6');
            await client.disconnect();
            console.log(hValuesResult);
            should(hValuesResult).be.not.null().and.containEql('test', 'test', true); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('get several values from hash dataset by field name', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let hGetResult= await client.hmGet('hash:6',['first_name', 'extra']);
            await client.disconnect();
            console.log(hGetResult);
            should(hGetResult).be.not.null().and.containEql('test', true); 
        } catch (error) {
            should(error).be.null();   
        }
    });
});