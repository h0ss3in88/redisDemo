import should from "should";
import {createClient} from "redis";
import {config} from "dotenv";

after(async () => {
    let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
    await client.connect();
    await client.flushDb();
    await client.disconnect();
});
describe('Redis String Commands ', function () {
    config();
    it('set and get', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect();
            let result = await client.set('first_name', 'hussein');
            let getResult = await client.get('first_name');
            await client.disconnect();
            should(result.toString()).be.not.null().and.eql('OK');
            should(getResult).be.not.null().and.eql('hussein');
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('del a key', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let x = await client.set('x', 'value of x');
            let delResult = await client.del('x');
            should(x).be.not.null().and.eql('OK');
            should(delResult).be.not.null().and.eql(1); 
            await client.disconnect();
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('find All Keys', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let x = await client.set('x', 'value of x');
            let y = await client.set('y', 'value of y');
            let z = await client.set('z', 'value of z');
            let findKeys = await client.keys('*');
            await client.disconnect();
            should(x).be.not.null().and.eql('OK');
            should(y).be.not.null().and.eql('OK');
            should(z).be.not.null().and.eql('OK');
            findKeys.should.be.instanceof(Array).and.have.lengthOf(4);
            should(findKeys).containDeep(['x','y','z','first_name']);
        } catch (error) {
            should.not.exist(error);
        }
    });
    it('incr and decr', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect();
            let setResult = await client.set('age', 35 );
            let incrResult = await client.incr('age');
            let decrResult = await client.decr('age');
            await client.disconnect();
            should(setResult).be.not.null().and.eql('OK');
            should(incrResult).be.not.null().and.eql(36); 
            should(decrResult).be.not.null().and.eql(35);            
        } catch (error) {
            should.not.exist(error);
        }
    });
    it('incrBy and decrBy', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect();
            let setResult = await client.set('age', 35 );
            let incrResult = await client.incrBy('age', 10);
            let decrResult = await client.decrBy('age', 5);
            await client.disconnect();
            should(setResult).be.not.null().and.eql('OK');
            should(incrResult).be.not.null().and.eql(45); 
            should(decrResult).be.not.null().and.eql(40);            
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('set key with expiration time in seconds', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect();
            let setResult = await client.setEx('message', 1500, 'Hello There ...');
            let ttlResult = await client.ttl('message');
            await client.disconnect();
            should(setResult).be.not.null().and.eql('OK');
            should(ttlResult).be.not.null().and.lessThanOrEqual(1500);
            should(ttlResult).be.not.null().and.greaterThan(1000);            
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('append to key', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect();
            let setResult = await client.set('message', 'Hello');
            let appendResult = await client.append('message', ' World!');
            await client.disconnect();
            should(setResult).be.not.null().and.eql('OK');
            should(appendResult).be.not.null().and.eql('Hello World!'.length);            
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('get length of a key', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect();
            let setResult = await client.set('message', 'Hello World!');
            let lengthResult = await client.strLen('message');
            await client.disconnect();
            should(setResult).be.not.null().and.eql('OK');
            should(lengthResult).be.not.null().and.eql('Hello World!'.length);            
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('set key if not exists', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let aOne = await client.setNX('a', 'value of A');
            let aTwo = await client.setNX('a', 'value of y');
            let aThree = await client.setNX('a', 'value of z');
            let getResult = await client.get('a');
            await client.disconnect();
            should(aOne).be.not.null().and.eql(true);
            should(aTwo).be.not.null().and.eql(false);
            should(aThree).be.not.null().and.eql(false);
            should(getResult).is.eql('value of A');
        } catch (error) {
            should.not.exist(error);
        }
    })
    it('set multiple keys with one command', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let aOne = await client.mSet(['a', 'value of A','b', 'value of B', 'c', 'value of C', 'd', 'value of D']);
            let aResult = await client.get('a');
            let bResult = await client.get('b');
            let cResult = await client.get('c');
            let dResult = await client.get('d');
            await client.disconnect();
            should(aResult).be.not.null().and.eql('value of A');
            should(bResult).be.not.null().and.eql('value of B');
            should(cResult).be.not.null().and.eql('value of C');
            should(dResult).is.eql('value of D');
        } catch (error) {
            should.not.exist(error);
        }
    });
    it('save json as value in a key', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let userSetResult = await client.set('user:1', JSON.stringify({'name': 'userOne', 'family' : 'userOneFamily', 'age': 15 , 'email': 'user@email.com'}));
            let getUser = await client.get('user:1');
            await client.disconnect();
            should(userSetResult).is.eql('OK');
            should(JSON.parse(getUser)).be.not.null().and.has.properties(['name','family','email','age','email']);
        } catch (error) {
            should.not.exist(error);
        }
    });
    it('set expiration of a key in millisecond', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let userSetResult = await client.pSetEx('user:2',15000 ,JSON.stringify({'name': 'userTwo', 'family' : 'userOneFamily', 'age': 15 , 'email': 'user@email.com'}));
            let getUser = await client.get('user:2');
            let ttlOfKey = await client.ttl('user:2');
            await client.disconnect();
            should(userSetResult).is.eql('OK');
            should(ttlOfKey).is.lessThanOrEqual(15000);
            should(JSON.parse(getUser)).be.not.null().and.has.properties(['name','family','email','age','email']);
        } catch (error) {
            should.not.exist(error);
        }
    });
});