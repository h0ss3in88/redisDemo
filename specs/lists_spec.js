import should from "should";
import {createClient} from "redis";
import {config} from "dotenv";

after(async () => {
    let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
    await client.connect();
    await client.flushDb();
    await client.disconnect();
});
describe('Redis Lists Commands ', function () {
    config();
    it('push to list', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect();
            let object = {'first': 'test', 'last': 'tets', 'age': 15 , 'email': 'test@test.com' , 'password': 'x@tetscaf'};
            let lPushResult = await client.lPush('list:1', JSON.stringify(object));
            let lPush1Result = await client.lPush('list:2', ['1','2','3','4','5','6','7','8','9','10']);
            let lPush2Result = await client.lPush('list:3',['11','12','13','14','15']);
            let lPush3Result = await client.lPush('list:3',['16','17','18','19','20']);
            await client.disconnect();
            should(lPushResult).is.eql(1);
            should(lPush1Result).is.eql(10);
            should(lPush2Result).is.eql(5);
            should(lPush3Result).is.eql(10);
        } catch (error) {
            console.log(error);
            should(error).be.null();   
        }
    });
    it('del a list', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let delResult = await client.del('list:1');
            await client.disconnect();
            console.log(delResult);
            should(delResult).be.not.null().and.eql(1); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('get all values in the list dataset', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let getListResult = await client.lRange('list:2', 0, -1);
            await client.disconnect();
            console.log(getListResult);
            should(getListResult.length).be.not.null().and.eql(10); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('pop a value from list dataset', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            await client.lPush('list:4', ['1','2']);
            let lPopResult = await client.lPop('list:4');
            let lRangeResult = await client.lRange('list:4',0,-1);
            await client.disconnect();
            console.log(lPopResult);
            console.log(lRangeResult);
            should(lPopResult).be.not.null().and.eql('2'); 
            should(lRangeResult).containEql('1'); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('get number of values in the list dataset', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let lLenResult = await client.lLen('list:4');
            await client.disconnect();
            console.log(lLenResult);
            should(lLenResult).be.not.null().and.eql(1); 
        } catch (error) {
            should.not.exist(error);
        }
    });
    it('get value at 2th index in the list dataset', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let getListResult = await client.lIndex('list:2',2);
            await client.disconnect();
            console.log(getListResult);
            should(getListResult).be.not.null().and.eql('8'); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('set value at 0th index of the list dataset', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let insertionResult = await client.lInsert('list:2','BEFORE', '10', '100');
            console.log(insertionResult);
            let lRangeResult = await client.lRange('list:2', 0 , -1);
            console.log(lRangeResult);
            const indx = await client.lIndex('list:2', 0);
            console.log(indx);
            await client.disconnect();

            should(parseInt(indx, 10)).be.not.null().and.eql(100); 
            should(insertionResult).be.not.null().and.eql(11);
            should(lRangeResult.length).be.not.null().and.eql(11); 
 
        } catch (error) {
            console.log(error);
            should(error).be.null();   
        }
    });
     
});