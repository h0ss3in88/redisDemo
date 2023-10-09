import should from "should";
import {createClient} from "redis";
import {config} from "dotenv";

after(async () => {
    let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
    await client.connect();
    await client.flushDb();
    await client.disconnect();
});
describe.only('Redis Sets Commands ', function () {
    config();
    it('add to set', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect();
            let object = {'first': 'test', 'last': 'tets', 'age': 15 , 'email': 'test@test.com' , 'password': 'x@tetscaf'};
            let sAddResult = await client.sAdd('set:1', JSON.stringify(object));
            let sAdd2Result = await client.sAdd('set:2', ['1','2','3','4','5','6','7','8','9','10']);
            let sAdd3Result = await client.sAdd('set:3',['11','12','13','14','15']);
            let sAdd4Result = await client.sAdd('set:3',['16','17','18','19','20']);
            await client.disconnect();
            should(sAddResult).is.eql(1);
            should(sAdd2Result).is.eql(10);
            should(sAdd3Result).is.eql(5);
            should(sAdd4Result).is.eql(5);
        } catch (error) {
            console.log(error);
            should(error).be.null();   
        }
    });
    it('del a set', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let delResult = await client.del('set:1');
            await client.disconnect();
            console.log(delResult);
            should(delResult).be.not.null().and.eql(1); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('get all values in the set ', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let getListResult = await client.sMembers('set:2');
            await client.disconnect();
            console.log(getListResult);
            should(getListResult.length).be.not.null().and.eql(10); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('intersection of two sets', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let setRInsertionResult = await client.sAdd('set:a',['1','2','3','4','5']);
            let setXInsertionResult = await client.sAdd('set:b',['1','2','3','4','5','6','7']);
            const interSection =  await client.sInter(['set:a','set:b']);
            console.log(interSection);
            await client.disconnect();
            console.log(setRInsertionResult);
            console.log(setXInsertionResult);
            should(setRInsertionResult).be.not.null().and.eql(5); 
            should(setXInsertionResult).be.eql(7);
        } catch (error) {
            should.not.exist(error);
        }
    });
    it('diff values from sets ', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let setRInsertionResult = await client.sAdd('set:n',['1','2','3','4','5']);
            let setXInsertionResult = await client.sAdd('set:m',['7','8','3','4','5','10','11']);
            const difference =  await client.sDiff(['set:n', 'set:m']);
            console.log(difference);
            await client.disconnect();
            should(setRInsertionResult).be.not.null().and.eql(5); 
            should(setXInsertionResult).be.not.null().and.eql(7); 
            should(difference).be.eql(['1','2']);
        } catch (error) {
            should.not.exist(error);
        }
    });
    it('delete values from the set ', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            const insertionResult = await client.sAdd('set:r', ['1','2','3','4','5']);
            const delResult = await client.sRem('set:r', ['1','2','3']);
            const setLength = await client.sCard('set:r');
            await client.disconnect();
            console.log(insertionResult);
            should(insertionResult).be.not.null().and.eql(5); 
            should(delResult).be.eql(3);
            should.exist(delResult);
            should(setLength).be.not.null().and.eql(2); 
        } catch (error) {
            should.not.exist(error);
        }
    });
    it('remove random value from the set' , async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let insertionResult = await client.sAdd('set:r', ['1','2','3','4','5']);
            console.log(insertionResult);
            let sPopResult = await client.sPop('set:r');
            console.log(sPopResult);
            const count = await client.sCard('set:r');
            console.log(count);
            await client.disconnect();

            should(sPopResult).be.not.null().and.be.equalOneOf(['1','2','3','4','5']);
            should(count).be.not.null().and.eql(4);
        } catch (error) {
            console.log(error);
            should.not.exist(error);
        }
    });
     
});