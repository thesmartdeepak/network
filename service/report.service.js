/**
 * @file(user.service.js) All service realted to user  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */
import Project from '../models/project.model';
import attendance from '../models/attendance.model';
import vendor from '../models/vendor.model';
import cab from '../models/cab.model';
import kit from '../models/kit.model';
import claimAdvance from '../models/claimAdvance.model';
import Circle from '../models/circle.model';
import Client from '../models/client.model';
import successMsg from '../core/message/success.msg'
import msg from '../core/message/error.msg.js'
import mongoose from 'mongoose';


/**
 * [service is a object ]
 * @type {Object}
 */

const service = {};

/**
 * @description [with all the calculation before getAll function of model and after getAll]
 * @param  {[object]}
 * @param  {[object]}
 * @return {[object]}
 */

const monthNames = {
    "january": 1,
    "february": 2,
    "march": 3,
    "april": 4,
    "may": 5,
    "june": 6,
    "july": 7,
    "august": 8,
    "september": 9,
    "october": 10,
    "november": 11,
    "december": 12
};

service.getBasicReport = async (req, res) => {
    let data = {};
    let today = new Date();
    let currentMonth1stDate = new Date(today.getFullYear(), today.getMonth(), 1);

    /* Circle */
    let circleToFind = {
        query: {},
        projection: { code: 1, name: 1 }
    }
    data.circle = await Circle.getSimpleCircle(circleToFind);
    /* /Circle */

    /* Circle client */
    let projectToFind = {
        group: {
            circleCode: "$circleCode",
            clientId: "$clientId",
            operator: "$operator"
        }
    }

    data.circleClient = await Project.getReport(projectToFind);

    projectToFind["query"] = {
        createAt: { "$gte": currentMonth1stDate }
    }
    data.circleClientCurrentMonth = await Project.getReport(projectToFind);

    /* /Circle client */

    /* Client */
    projectToFind = {
        group: "$operator"
    };
    data.client = await Project.getReport(projectToFind);

    projectToFind["query"] = {
        createAt: { "$gte": currentMonth1stDate }
    }
    data.clientCurrentMonth = await Project.getReport(projectToFind);
    /* /Client */

    /* Department project type */
    projectToFind = {
        group: {
            departmentName: "$departmentName",
            projectTypeName: "$projectTypeName",
        }
    }

    data.departmentProjectType = await Project.getReport(projectToFind);

    projectToFind["query"] = {
        createAt: { "$gte": currentMonth1stDate }
    }
    data.departmentProjectTypeCurrentMonth = await Project.getReport(projectToFind);
    /* /Department project type */

    return res.send({ success: true, code: 200, data: data });
}


service.getGraphicalReport = async (req, res) => {

    let data = {};
    let today = new Date();

    let tenMonthBefore = new Date(today.getFullYear(), today.getMonth() - 9, 1);

    /* Circle */
    let circleToFind = {
        query: {},
        projection: { code: 1, name: 1 }
    }
    data.circle = await Circle.getSimpleCircle(circleToFind);
    /* /Circle */

    /* Client montly report */
    let projectToFind = {
        group: {
            name: "$operator",
            monthYear: { $substr: ['$createAt', 0, 7] },
        },
        query: { createAt: { "$gte": tenMonthBefore } },
        sort: { createAt: -1 }
    }

    data.clientMontly = await Project.getReport(projectToFind);
    /* /Client montly report */

    /* Circle montly report */
    projectToFind = {
        group: {
            name: "$circleCode",
            monthYear: { $substr: ['$createAt', 0, 7] },
        },
        query: { createAt: { "$gte": tenMonthBefore } },
        sort: { createAt: -1 }
    }

    data.circleMontly = await Project.getReport(projectToFind);
    /* /Circle montly report */

    /* Department montly report */
    projectToFind = {
        group: {
            name: "$departmentName",
            monthYear: { $substr: ['$createAt', 0, 7] },
        },
        query: { createAt: { "$gte": tenMonthBefore } },
        sort: { createAt: -1 }
    }

    data.departmentMontly = await Project.getReport(projectToFind);
    /* /Department montly report */

    /* Client pie */ 
    projectToFind = {
        group: "$operator",
        // query:{createAt:{"$gte":tenMonthBefore}},
        // sort:{createAt:-1}
    }

    data.clientPie = await Project.getReport(projectToFind);
    /* /Client pie */

    /* Circle pie */
    projectToFind = {
        group: "$circleCode",
        // query:{createAt:{"$gte":tenMonthBefore}},
        // sort:{createAt:-1}
    }

    data.circlePie = await Project.getReport(projectToFind);
    /* /Circle pie */

    /* Department pie */
    projectToFind = {
        group: "$departmentName",
        // query:{createAt:{"$gte":tenMonthBefore}},
        // sort:{createAt:-1}
    }

    data.departmentPie = await Project.getReport(projectToFind);
    /* /Department pie */

    return res.send({ success: true, code: 200, data: data });
}

service.getMisClientCircle = async (req, res) => {
    var toDate = new Date(req.body.toDate);
    // toDate.setDate(toDate.getDate() + 1);
    let data = {};
    let query = [];
    //
    // if(req.body.fromDate && req.body.toDate){
    //    query.push({$or:[
        
    //         { preDoneDate: {
    //              $gte: new Date(req.body.fromDate),
    //              $lte: toDate
    //          }},
    //         { post_ActivityDoneDate: {
    //              $gte: new Date(req.body.fromDate),
    //              $lte: toDate
    //          }}
    //      ]});
    // }

    query.push({$or:[
        
        { preDoneDate: {
             $gte: new Date(req.body.fromDate),
             $lte: toDate
         }},
        { post_ActivityDoneDate: {
             $gte: new Date(req.body.fromDate),
             $lte: toDate
         }}
    ]});
    
    //

//     if (req.body.fromDate) {
//    query.push({ "createdAt": { $gte: new Date(req.body.fromDate) } });
//     }

//     if (req.body.toDate) {
//    let toDate = new Date(req.body.toDate);
//         toDate.setDate(toDate.getDate() + 1);
//         query.push({ "createdAt": { $lte: toDate } });
//     }

    if (req.body.client) {
        query.push({ "clientId": mongoose.Types.ObjectId(req.body.client) });
    }


    let projectToFind = {
        group: {
            client: "$clientName",
            circle: "$circleCode"
        }
    }

    if (query[0]) {
        projectToFind.query = { $and: query };
    }



    data.circleClientSite = await Project.getReport(projectToFind);


    query.push({ reportAcceptanceStatus: "Accepted" });
    let aggregate = [
        { $match: { $and: query } },
        {
            $project: {
                client: "$clientName", 
                circle: "$circleCode",
                amount: "$poAmount",
                percentage:"$percentage",
                preDoneDate:"$preDoneDate",
                post_ActivityDoneDate:"$post_ActivityDoneDate"
            }
        },
    ];
    data.circleClientAcceptance = await Project.getAggregate(aggregate);

    return res.send({ success: true, code: 200, data: data });
}

service.getMisBusiness = async (req, res) => {
    let data = {};

    let query = [];
    // if(req.body.fromDate && req.body.toDate){
    //     query.push({$or:[
    //         { preDoneDate: {
    //             $gte: new Date(req.body.fromDate),
    //             $lte: toDate
    //         }},
    //         { post_ActivityDoneDate: {
    //             $gte: new Date(req.body.fromDate),
    //             $lte: toDate
    //         }}
    //     ]});
    // }

    var toDate = new Date(req.body.toDate);
    
    query.push({$or:[
        
        { preDoneDate: {
             $gte: new Date(req.body.fromDate),
             $lte: toDate
         }},
        { post_ActivityDoneDate: {
             $gte: new Date(req.body.fromDate),
             $lte: toDate
         }}
    ]});

    // if (req.body.fromDate) {
    //     query.push({ "createdAt": { $gte: new Date(req.body.fromDate) } });
    // }

    // if (req.body.toDate) {
    //     let toDate = new Date(req.body.toDate);
    //     toDate.setDate(toDate.getDate() + 1);
    //     query.push({ "createdAt": { $lte: toDate } });
    // }

    if (req.body.clientId) {
        query.push({ "clientId": mongoose.Types.ObjectId(req.body.clientId) });
    }

    if (req.body.circleCode) {
        query.push({ "circleCode": req.body.circleCode });
    }
    if (req.body.operatorId) {
        query.push({ "operatorId": mongoose.Types.ObjectId(req.body.operatorId) });
    }
    if (req.body.activityId) {
        query.push({ "activityId": mongoose.Types.ObjectId(req.body.activityId) });
    }

    var match = {};
    if (query[0]) {
        match = { $and: query };
    }

    // let aggregate = [
    //     { $match: match },
    //     {
    //         $project: {
    //             acceptanceRow: { $cond: { if: { $eq: ["$reportAcceptanceStatus", "Accepted"] }, then: 1, else: 0 } },
    //             notAcceptedDone: { $cond: { if: { $and: [{ $ne: ["$reportAcceptanceStatus", "Accepted"] }, { $eq: ["$activityStatus", "Done"] }] }, then: 1, else: 0 } },
    //             acceptanceAmountRow: { $cond: { if: { $eq: ["$reportAcceptanceStatus", "Accepted"] }, then: "$poAmount", else: 0 } },
    //             circleCode: "$circleCode",
    //             clientName: "$clientName",
    //             operatorName: "$operatorName",
    //             activity: "$activity",
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: { circle: "$circleCode", client: "$clientName", operator: "$operatorName", activity: "$activity" },
    //             amount: { $sum: "$acceptanceAmountRow" },
    //             acceptance: { $sum: "$acceptanceRow" },
    //             notAcceptedDone: { $sum: "$notAcceptedDone" },
    //             totalSite: { $sum: 1 }
    //         },
    //     }
    // ];

    let projectToFind = {
        group: {
            client: "$clientName",
            circle: "$circleCode",
            operator: "$operatorName",
            activity: "$activity",
        }
    }

    if (query[0]) {
        projectToFind.query = { $and: query };
    }
    
    data.circleClientSite = await Project.getReport(projectToFind);

    // query.push({ reportAcceptanceStatus: "Accepted" });
    let aggregate = [
        { $match: { $and: query } },
        {
            $project: {
                client: "$clientName", 
                circle: "$circleCode",
                operator: "$operatorName",
                activity: "$activity",
                amount: "$poAmount",
                percentage:"$percentage",
                preDoneDate:"$preDoneDate",
                post_ActivityDoneDate:"$post_ActivityDoneDate",
                reportAcceptanceStatus:"$reportAcceptanceStatus"
            }
        },
    ];

    data.busniess = await Project.getAggregate(aggregate);

    return res.send({ success: true, code: 200, data: data });
}

service.getMisSalary = async (req, res) => {

    let data = {};

    let query = [];
    if (req.body.year) {
        query.push({ "year": parseInt(req.body.year) });
    }
    if (req.body.month) {
        query.push({ "month": req.body.month });
    }
    if (req.body.circleCode) {
        query.push({ "circleName": req.body.circleCode });
    }
    if (req.body.empName){
        query.push({ "employeeName": new RegExp(req.body.empName,'i') });
    }
    let workingStatus = [
        /working/i,
        /ideal/i,
        /movement/i,
        /week off/i,
    ];

    query.push({ "empStatus": { $in: workingStatus } });

    let aggregate = [
        {
            $match: { $and: query }
        },
        {
            $group:
            {
                _id: {employeeUserId:"$employeeUserId",circleId:"$circleId"},
                "days": { $sum: 1 },
                "processSalary": { $sum: "$perDaySalary" },
                "salary": { $last: "$salary" },
                "employeeName": { $last: "$employeeName" },
                "circleName": {$last:"$circleName"}
            }
        },

    ];
    data.user = await attendance.salaryMis(aggregate);

    return res.send({ success: true, code: 200, data: data });
}

service.getAllCircleForReporting = async (req, res) => {
    /* Circle */
    let circleToFind = {
        query: {},
        projection: { code: 1, name: 1 }
    }
    let circle = await Circle.getSimpleCircle(circleToFind);
    /* /Circle */
    return res.send({ success: true, code: 200, data: circle });
}

service.getAllClinetForReporting = async (req, res) => {
    let clientToFind = {
        query: {},
        projection: { _id: 1, name: 1 }
    }
    let client = await Client.getAll(clientToFind);
    return res.send({ success: true, code: 200, data: client });
}

service.getMisClaimAdvance = async (req, res) => {
    let data = {};
    let aggregate = [];

    let query = [];
    if (req.body.year) {
        query.push({ "year": parseInt(req.body.year) });
    }
    if (req.body.month) {
        query.push({ "month": req.body.month });
    }
    let match = {};
    if (query[0]) {
        match = {
            $match: { $and: query },
        }

        aggregate.push(match);
    }



    let group = {
        $group:
        {
            _id: "$empUserId",
            "totalTransfer": { $sum: "$totalTransfer" },
            "empName": { $last: "$empName" },
            "empId": { $last: "$empId" },
        },

    };

    aggregate.push(group);

    data.user = await claimAdvance.claimAdvanceMis(aggregate);
    return res.send({ success: true, code: 200, data: data });
}

service.getMisVendor = async (req, res) => {
    let data = {};
    let aggregate = [];

    let query = [];
    if (req.body.year) {
        query.push({ "year": parseInt(req.body.year) });
    }
    if (req.body.month) {
        query.push({ "month": req.body.month });
    }
    if (req.body.clientName) {
        query.push({ "clientName": req.body.clientName });
    }

    if (req.body.circleName) {
        query.push({ "circleName": req.body.circleName });
    }
    if (req.body.activityName) {
        query.push({ "activityName": req.body.activityName });
    }
    let match = {};
    if (query[0]) {
        match = {
            $match: { $and: query },

        };
        aggregate.push(match);
    }

    let group = {
        $group: {
            _id: { vendorName: "$vendorName", vendorType: "$vendorType", activityName: "$activityName", clientName: "$clientName", circleName: "$circleName" },
            // "siteCount":{$sum:"$siteCount"},
            //"poAmount":{$sum:"$poAmount"},
            "totalAmount": { $sum: "$totalAmount" },
            "vendorName": { $last: "$vendorName" },
            "vendorType": { $last: "$vendorType" },
            "activityName": { $last: "$activityName" },
            // "projectCode":{$last:"$projectCode"},
            "clientName": { $last: "$clientName" },
            "circleName": { $last: "$circleName" },
        },
    };

    aggregate.push(group);

    data.user = await vendor.vendorMis(aggregate);
    return res.send({ success: true, code: 200, data: data });
}
service.getMisCab = async (req, res) => {
    let data = {};
    let aggregate = [];

    let query = [];
    if (req.body.year) {
        query.push({ "year": parseInt(req.body.year) });
    }
    if (req.body.month) {
        query.push({ "month": req.body.month });
    }
    if (req.body.clientName) {
        query.push({ "clientName": req.body.clientName });
    }

    if (req.body.circleName) {
        query.push({ "circleName": req.body.circleName });
    }

    let match = {};
    if (query[0]) {
        match = {
            $match: { $and: query },

        };
        aggregate.push(match);
    }

    let group = {
        $group: {
            _id: { vendorName: "$vendorName", vendorType: "$vendorType", month: "$month", clientName: "$clientName", circleName: "$circleName" },
            "totalAmount": { $sum: "$totalAmount" },
            "vendorName": { $last: "$vendorName" },
            "vendorType": { $last: "$vendorType" },
            "month": { $last: "$month" },
            "clientName": { $last: "$clientName" },
            "circleName": { $last: "$circleName" },
        },
    };

    aggregate.push(group);

    data.user = await cab.cabMis(aggregate);
    return res.send({ success: true, code: 200, data: data });
}
service.getMisKit = async (req, res) => {
    
    let dataToFind = {
        query:{},
        projection:{
            _id:1,
            kitName:1,
            kitRent:1,
            empUserId:1,
            empName:1,
            createAt:1
        }
    };
    let data = {};

    if (req.body.toDate) {
        dataToFind.query["createAt"] = { $lte: new Date(req.body.toDate) };
    }
   
    // let match = {};
    // if (query[0]) {
    //     match = {
    //         $match: { $and: query },

    //     };
    //     dataToFind = {};
    // }

//     let group = {
//         $group: {
//             _id: { empUserId: "$empUserId", kitName: "$kitName" },
//             "totalAmount": { $sum: "$perDayAmount" },
//             "empName": { $last: "$empName" },
//             "kitName": { $last: "$kitName" },
//             "kitRent": { $last: "$kitRent" },
//             "createAt": { $last: "$createAt" }
//         },
//     };

//  aggregate.push(group);

    data.user = await kit.kitMis(dataToFind);
    return res.send({ success: true, code: 200, data: data });
};
service.getMisPL = async (req, res) => {
    let data = {};
    let query = [];
    if (req.body.year) {
        query.push({ "year": parseInt(req.body.year) });
    }
    if (req.body.month) {
        query.push({ "month": req.body.month });
    }


    let match = {};

    //Project
    let queryProject = [];

    queryProject.push({ reportAcceptanceStatus: "Accepted" });

    if (req.body.year) {
        queryProject.push({ year: parseInt(req.body.year) });
    }
    if (req.body.month) {
        
        queryProject.push({ month: monthNames[req.body.month.toLowerCase()] });
    }

    let aggregateprojectDetails = [
        {
            $project: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                reportAcceptanceStatus: "$reportAcceptanceStatus",
                poAmount: "$poAmount",
                circleCode: "$circleCode",
                clientName: "$clientName",
                projectCode: "$projectCode"
            }
        },
        { $match: { $and: queryProject } },
        {
            $group: {
                _id: "$projectCode",
                amount: { $sum: "$poAmount" },
                circleCode: { $last: "$circleCode" },
                clientName: { $last: "$clientName" }
            }
        }
    ];

    data.projectDetails = await Project.getAggregate(aggregateprojectDetails);
    //kit
    let aggregateKit = [];
    let querykit = [];
    // if (req.body.year) {
    //     querykit.push({ "year": parseInt(req.body.year) });
    // }
    // if (req.body.month) {
    //     querykit.push({ "month": req.body.month });
    // }
    if (req.body.year && req.body.month) {
        // let compairDate = new Date("01/"+req.body.month+"/"+req.body.year);
        let month = monthNames[req.body.month.toLowerCase()];
        var compairDate = new Date(req.body.year, month, 0);
        querykit.push({"createAt":{$lte: compairDate }});
    }
    let matchkit = {};
    if (querykit[0]) {
        matchkit = {
            $match: { $and: querykit },
        };
        aggregateKit.push(matchkit);
    }
    let project = {
        $project: { 
            "projectCode":"$projectCode",
            "kitRent":"$kitRent",
            "createAt":"$createAt"
        }
    };
    aggregateKit.push(project);
    // let groupKit = {
    //     $group: {
    //         _id: "$projectCode",
    //         "totalAmount": { $sum: "$perDayAmount" },
    //         "kitRent": { $sum: "$kitRent" },
    //         "createAt": { $last: "$createAt" }
    //     },
    // };

    // aggregateKit.push(groupKit);

    data.kitDetails = await kit.kitMis(aggregateKit);
    //Salary
    let querySalery = [];
    //
    if (req.body.year) {
        querySalery.push({ "year": parseInt(req.body.year) });
    }
    if (req.body.month) {
        querySalery.push({ "month": req.body.month });
    }
    let workingStatus = [
        /working/i,
        /ideal/i,
        /movement/i,
        /week off/i,
    ];
    querySalery.push({ "empStatus": { $in: workingStatus } });

    let aggregateSalery = [
        {
            $match: { $and: querySalery }
        },
        {
            $group:
            {
                _id: "$projectCode",
                "processSalary": { $sum: "$perDaySalary" },
            }
        },

    ];
    data.salaryDetails = await attendance.salaryMis(aggregateSalery);
    //Advance Claim
    let aggregateAdvance = [];
    //
    let queryAdvance = [];
    if (req.body.year) {
        queryAdvance.push({ "year": parseInt(req.body.year) });
    }
    if (req.body.month) {
        queryAdvance.push({ "month": req.body.month });
    }
    let matchAdvance = {};
    if (query[0]) {
        matchAdvance = {
            $match: { $and: queryAdvance },
        }

        aggregateAdvance.push(matchAdvance);
    }
    //
    let advanceClaim = {
        $group:
        {
            _id: "$projectCode",
            "totalTransfer": { $sum: "$totalTransfer" },
        },

    };

    aggregateAdvance.push(advanceClaim);

    data.advanceClaimDetails = await claimAdvance.claimAdvanceMis(aggregateAdvance);
    //Cab
    let aggregateCab = [];
    //
    let queryCab = [];
    if (req.body.year) {
        queryCab.push({ "year": parseInt(req.body.year) });
    }
    if (req.body.month) {
        queryCab.push({ "month": req.body.month });
    }
    let matchCab = {};
    if (query[0]) {
        matchCab = {
            $match: { $and: queryCab },
        }

        aggregateCab.push(matchCab);
    }
    //
    let groupcab = {
        $group: {
            _id: "$projectCode",
            "totalAmount": { $sum: "$totalAmount" },
        },
    };

    aggregateCab.push(groupcab);

    data.cabDetails = await cab.cabMis(aggregateCab);
    //vendor
    let aggregateVendor = [];
    //
    let queryVendor = [];
    if (req.body.year) {
        queryVendor.push({ "year": parseInt(req.body.year) });
    }
    if (req.body.month) {
        queryVendor.push({ "month": req.body.month });
    }
    let matchVendor = {};
    if (query[0]) {
        matchVendor = {
            $match: { $and: queryVendor },
        }

        aggregateVendor.push(matchVendor);
    }
    //
    let groupVendor = {
        $group: {
            _id: "$projectCode",
            "totalAmount": { $sum: "$totalAmount" },
        },
    };

    aggregateVendor.push(groupVendor);

    data.vendorDetails = await vendor.vendorMis(aggregateVendor);
    return res.send({ success: true, code: 200, data: data });
}
export default service;
