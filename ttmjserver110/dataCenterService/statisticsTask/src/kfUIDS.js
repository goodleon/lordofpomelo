/**
 * Created by lhq on 2016/12/16 0016.
 * 跑前面客服售卖玩家ID的程序
 */


module.exports = function(dbUrl, day, lev, endF, errF)
{
    var saveDay = day;
    var adminLev = lev;
    var month = saveDay.substr(0,6);
    var collMemberConsumptionRecords = "memberConsumptionRecords" + month; //查询每日会员统计
    var collMembers = "members";//查询会员信息-得到区域经理-客户经理-会员的关系
    var collectionName = "achievement"+month;//保存每日业绩统计
    //console.log("\n\n\n开始写入 "+adminLev+"=== yesterday: "+saveDay+", collMemberConsumptionRecords: "+collMemberConsumptionRecords);

    require('mongodb').MongoClient.connect(dbUrl, function (er, db)
    {
        /**
         * 统计会员和客户经理关系
         * */
        var mList = {};
        var mCount = {};
        var mRelation = {};
        var mData = {};//最终找出的客户经理

        function initManagerData(mid) {
            if(mData[mid]) return;

            mData[mid] = {
                "sellNumMember" : 0,    //售出钻石会员
                "sellNum" : 0, 	        //售出的钻石
                "sellMoneyMember" : 0,  //售出钱的会员
                "sellMoney" : 0,	    //售出的钱数

                "buyNumMember" : 0,     //买入钻石会员
                "buyNum" : 0,   	    //买入钻石
                "buyMoneyMember" : 0,   //充值会员
                "buyMoney" : 0, 	    //充值总额
                "memberCount" : mCount[mid],      //会员总数
                "buyIds" : {},           //每日购买的ID列表
                "sellIds" : {},          //每日卖出的ID列表
                "userIds" : {}           //每日购买玩家的ID
            };
        }

        function filterUid(uid)
        {
            return uid > 10000;
        }

        function closeDb()
        {
            db.close();
        }

        //每天统计
        function writeAllUsers()
        {
            var ids = Object.keys(mData);
            var len = ids.length;
            var i = 0;

            function save() {
                if(i >= len) {
                    //console.info(dbUrl+', 操作结束'+' i = '+i+' len = '+len);
                    endF(dbUrl+", 写入成功: "+saveDay);
                    closeDb();
                    return;
                }

                var mid = ids[i];
                var para = {};
                para.$set = {};


                var find = {};
                find[saveDay] = 1;

                db.collection(collectionName).findOne({_id:mid}, find, function(er, doc) {
                    if(doc && doc[saveDay]) {
                        doc[saveDay].userIds = mData[mid].userIds;
                        para.$set[saveDay] = doc[saveDay];
                        db.collection(collectionName).update({_id:mid}, para, {upsert:true}, function (er, rtn) {
                            i++;
                            save();
                        });
                    } else {
                        para.$set[saveDay] = mData[mid];

                        db.collection(collectionName).update({_id:mid}, para, {upsert:true}, function (er, rtn) {
                            i++;
                            save();
                        });
                    }
                });
            }

            save();
        }

        //某天会员数据
        function findAll()
        {
            var para = {};
            para[saveDay] = 1;

            db.collection(collMemberConsumptionRecords).find({}, para).each(function (err, doc) {
                // console.info('findAll == ' + JSON.stringify(doc));
                if (doc && doc._id && doc[saveDay]) {
                    var mid = doc._id;
                    var byMid = mRelation[mid];
                    var conData = doc[saveDay];

                    if (byMid && mList[byMid]) {
                        initManagerData(byMid);
                        var data = mData[byMid];

                        if(conData.sellAllUser) {
                            var ids = Object.keys(conData.sellAllUser);

                            for(var i = 0; i < ids.length; i++) {
                                var id = ids[i];

                                if(data.userIds[id]) {
                                    data.userIds[id] += conData.sellAllUser[id];
                                } else {
                                    data.userIds[id] = conData.sellAllUser[id];
                                }
                            }
                        }
                    }
                }  else if (!doc) {
                    writeAllUsers();
                }

            });
        }

        /**
         * 统计会员和客户经理关系
         * */
        function BaseInfo() {
            db.collection(collMembers).find().each(function (er, doc) {
                if(doc && doc._id && filterUid(doc._id) && "byMid" in doc) {
                    var byMid = doc.byMid;

                    if(byMid && (!doc.adminLevel || doc.adminLevel == 2)) {
                        mRelation[doc._id] = byMid;

                        if(!mCount[byMid]) mCount[byMid] = 1;
                        else mCount[byMid]++;
                    }

                    if(doc.adminLevel == 1) {
                        mList[doc._id] = 1;
                    }
                } else if(!doc) {
                    //console.info('mList === ' + JSON.stringify(Object.keys(mList)));
                    findAll();
                }
            });
        }
        BaseInfo();
    });
}

//下面命令 第三个参数为1：从头开始跑数据，否则只跑前一天数据
//node webadmin/statistics/src/userStatistics.js 1

var tools = require("./tools")();
const adminStatistics = require('./kfUIDS.js');
var date = '2016-7-1';
var today = null;

if(process.argv.length == 3 && process.argv[2] == 1) {
    //从头开始跑的逻辑
    date = new Date(date);
    today = tools.Format(new Date(),'yyyyMMdd');
    today = parseInt(today);
    function runStatic() {
        var str = tools.Format(date, 'yyyyMMdd') + "";

        if (parseInt(str) >= today) {
            console.info('static end');
            return;
        }

        adminStatistics(tools.url, str, 1, function (msg) {
            console.info(msg);
            date.setDate(date.getDate() + 1);
            runStatic();
        }, function (msg) {
            console.info('error======== '+msg);
        });
    }

    runStatic();
}
else
{
    //跑前一天的数据
    today = new Date();
    today.setDate(today.getDate() - 1);
    var day = tools.Format(today, 'yyyyMMdd');
    adminStatistics(tools.url, day, 1, function (msg) {
        console.info(msg);
    }, function (msg) {
        console.info(msg);
    });
}