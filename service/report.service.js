/**
 * @file(user.service.js) All service realted to user  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */
import Project from '../models/project.model';
import Circle from '../models/circle.model';
import successMsg from '../core/message/success.msg'
import msg from '../core/message/error.msg.js'


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

service.getBasicReport = async (req,res) => {
    let data = {};
    let today = new Date();
    let currentMonth1stDate = new Date(today.getFullYear(), today.getMonth(), 1);

    /* Circle */
    let circleToFind = {
        query:{},
        projection:{code:1,name:1}
    }
    data.circle = await Circle.getSimpleCircle(circleToFind);
    /* /Circle */

    /* Circle client */
    let projectToFind = {
        group:{
            circleCode:"$circleCode",
            clientId:"$clientId",
            operator:"$operator"
        }
    }

    data.circleClient = await Project.getReport(projectToFind);

    projectToFind["query"] = {
        createAt:{"$gte":currentMonth1stDate}
    }
    data.circleClientCurrentMonth = await Project.getReport(projectToFind);
    
    /* /Circle client */

    /* Client */
    projectToFind = {
        group:"$operator"
    };
    data.client = await Project.getReport(projectToFind);

    projectToFind["query"] = {
        createAt:{"$gte":currentMonth1stDate}
    }
    data.clientCurrentMonth = await Project.getReport(projectToFind);
    /* /Client */

    /* Department project type */
    projectToFind = {
        group:{
            departmentName:"$departmentName",
            projectTypeName:"$projectTypeName",
        }
    }

    data.departmentProjectType = await Project.getReport(projectToFind);

    projectToFind["query"] = {
        createAt:{"$gte":currentMonth1stDate}
    }
    data.departmentProjectTypeCurrentMonth = await Project.getReport(projectToFind);
    /* /Department project type */

    return res.send({success:true,code:200,data:data});
}


service.getGraphicalReport = async (req,res) => {
    
    let data = {};
    let today = new Date();

    let tenMonthBefore = new Date(today.getFullYear(), today.getMonth()-9, 1);

    /* Circle */
    let circleToFind = {
        query:{},
        projection:{code:1,name:1}
    }
    data.circle = await Circle.getSimpleCircle(circleToFind);
    /* /Circle */

    /* Client montly report */
    let projectToFind = {
        group:{
            name:"$operator",
            monthYear:{$substr: ['$createAt', 0, 7]},
        },
        query:{createAt:{"$gte":tenMonthBefore}},
        sort:{createAt:-1}
    }

    data.clientMontly = await Project.getReport(projectToFind);
    /* /Client montly report */

    /* Circle montly report */
    projectToFind = {
        group:{
            name:"$circleCode",
            monthYear:{$substr: ['$createAt', 0, 7]},
        },
        query:{createAt:{"$gte":tenMonthBefore}},
        sort:{createAt:-1}
    }

    data.circleMontly = await Project.getReport(projectToFind);
    /* /Circle montly report */

    /* Department montly report */
    projectToFind = {
        group:{
            name:"$departmentName",
            monthYear:{$substr: ['$createAt', 0, 7]},
        },
        query:{createAt:{"$gte":tenMonthBefore}},
        sort:{createAt:-1}
    }

    data.departmentMontly = await Project.getReport(projectToFind);
    /* /Department montly report */

    /* Client pie */
    projectToFind = {
        group:"$operator",
        // query:{createAt:{"$gte":tenMonthBefore}},
        // sort:{createAt:-1}
    }

    data.clientPie = await Project.getReport(projectToFind);
    /* /Client pie */

    /* Circle pie */
    projectToFind = {
        group:"$circleCode",
        // query:{createAt:{"$gte":tenMonthBefore}},
        // sort:{createAt:-1}
    }

    data.circlePie = await Project.getReport(projectToFind);
    /* /Circle pie */

    /* Department pie */
    projectToFind = {
        group:"$departmentName",
        // query:{createAt:{"$gte":tenMonthBefore}},
        // sort:{createAt:-1}
    }

    data.departmentPie = await Project.getReport(projectToFind);
    /* /Department pie */

    return res.send({success:true,code:200,data:data});
}

export default service;
