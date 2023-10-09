import should from "should";
import {createClient} from "redis";
import {config} from "dotenv";

after(async () => {
    let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
    await client.connect();
    await client.flushDb();
    await client.disconnect();
});
describe('Redis Ordered Sets Commands ', function () {
    config();
    it('add to set', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect();
            let object = {'first': 'test', 'last': 'tets', 'age': 15 , 'email': 'test@test.com' , 'password': 'x@tetscaf'};
            let zAddResult = await client.zAdd('zSet:1', { score : 60 , value : JSON.stringify(object)});
            console.log(zAddResult);
            let zAdd2Result = await client.zAdd('zSet:2', {score : 100 , value : '1'});
            let zAdd3Result = await client.zAdd('zSet:3', {score : 131 , value : '11' });
            let zAdd4Result = await client.zAdd('zSet:3', { score : 145 , value : '16' });
            let zAddResult5 = await client.zAdd('zSet:4', { score : 120 , value : 'Hussein' });
            
            await client.disconnect();
            should(zAddResult).is.eql(1);
            should(zAdd2Result).is.eql(1);
            should(zAdd3Result).is.eql(1);
            should(zAdd4Result).is.eql(1);
            should(zAddResult5).is.eql(1);

        } catch (error) {
            console.log(error);
            should.not.exist(error);
        }
    });
    it('del a set', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let delResult = await client.del('zSet:1');
            await client.disconnect();
            console.log(delResult);
            should(delResult).be.not.null().and.eql(1); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('get all values in the zSet:3 ', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            const zRangeResult = await client.zRange('zSet:3',0, -1);
            console.log(zRangeResult);
            await client.disconnect();
            console.log(zRangeResult);
            should(zRangeResult.length).be.not.null().and.eql(2); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('get length of set', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            await client.s
            let zCardResult = await client.zCard('zSet:3')
            await client.disconnect();
            console.log(zCardResult);
            should(zCardResult).be.not.null().and.eql(2); 
        } catch (error) {
            should(error).be.null();   
        }
    });
    it('get scores of values in the set dataset', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let zScoreResult = await client.zScore('zSet:3', '11');
            await client.disconnect();
            console.log(zScoreResult);
            should(zScoreResult).be.not.null().and.eql(131); 
        } catch (error) {
            console.log(error);
            should.not.exist(error);
        }
    });
    it('remove the member in the zSet:2 dataset', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let zRemResult = await client.zRem('zSet:2', '1');
            console.log(zRemResult);
            await client.disconnect();
            should(zRemResult).be.not.null().and.eql(1); 
        } catch (error) {
            console.log(error);
            should(error).be.null();   
        }
    });
    it.only('get the difference between of sets ', async () => {
        try {
            let client = createClient({url: process.env.REDIS_CONNECTION, database: 2 });
            await client.connect(); 
            let zSet5 = await client.zAdd('zSet:5',[{ score : 1 , value : 'Hussein' } ,{ score :  2 , value : 'ALI' }, { score : 3 , value : 'Reza'}]);
            let zSet6 = await client.zAdd('zSet:6',[{ score : 1 , value : 'Hussein' } ,{ score :  2 , value : 'ALI' }, { score : 3 , value : 'Reza'}, { score : 4 , value : 'sepideh'}]);
            let zSet7 = await client.zAdd('zSet:7',[{ score : 1 , value : 'Hussein' } ,{ score :  2 , value : 'ALI' }, { score : 3 , value : 'Reza'}, { score : 4 , value : 'sepideh'}, {score : 5 , value : 'Aida'}]);


            console.log(zSet5);
            console.log(zSet6);
            console.log(zSet7);
            let zDiffResult = await client.zDiff(['zSet:6', 'zSet:5']);
            let zDiff2Result = await client.zDiff(['zSet:7', 'zSet:6']);
            console.log(zDiffResult);
            console.log(zDiff2Result);
            await client.disconnect();

            should(zDiffResult).be.not.null().and.containEql('Sepideh');
            should(zDiff2Result).be.not.null().and.containEql('Aida');
 
        } catch (error) {
            console.log(error);
            should(error).be.null();   
        }
    });
     
});