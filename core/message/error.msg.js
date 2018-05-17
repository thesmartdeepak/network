/**
 * @file(error.msg.js) All service realted to errors    
 * @author Purti Singh <purti.singh20@gmail.com>
 * @lastModifed 07-Feb-2018
 * @lastModifedBy Purti
 */


 /**
 * [service is a object ]
 * @type {Object}
 */

const msg = {};

/** Error message for _id*/
msg._id ="_id is missing"


/** Error message for status*/
msg.status ="status is missing"


/******                                    */
/** Region related error messages */
/******                                   */


/** Error message for getting region */
msg.getRegion ="Unable to get region"


/** Error message for adding region */
msg.addRegion ="Unable to add region"


/** Error message for editing region */
msg.editRegion ="Unable to edit region"


/** Error message for deleting region */
msg.deleteRegion ="Unable to delete region"

/** Error message for region id */
msg.regionId ="Region Id is missing"


/******                                    */
/** User related error messages */
/******                                   */


/** Error message for getting user */
msg.getUser ="Unable to get user"


/** Error message for adding user */
msg.addUser ="Unable to add user"


/** Error message for editing user */
msg.editUser ="Unable to edit user"


/** Error message for deleting user */
msg.deleteUser ="Unable to delete user"


/** Error message for user id */
msg.userId ="User Id is missing"


/** Error message for email id */
msg.emailId ="Email Id is missing"


/** Error message for password */
msg.password ="Password is missing"


/** Error message for login */
msg.login ="Unable to login"


/******                                    */
/** Usertype related error messages */
/******                                   */


/** Error message for getting usertype */
msg.getUserType ="Unable to get usertype"


/** Error message for adding usertype */
msg.addUserType ="Unable to add usertype"


/** Error message for editing usertype */
msg.editUserType ="Unable to edit usertype"


/** Error message for deleting usertype */
msg.deleteUserType ="Unable to delete usertype"


/** Error message for usertype name */
msg.userType ="Usertype name is missing"


/******                                    */
/** Circle related error messages */
/******                                   */


/** Error message for getting circle */
msg.getCircle ="Unable to get circle"


/** Error message for adding circle */
msg.addCircle ="Unable to add circle"


/** Error message for editing circle */
msg.editCircle ="Unable to edit circle"


/** Error message for deleting circle */
msg.deleteCircle ="Unable to delete circle"

/** Error message for circle id */
msg.circleId ="Circle Id is missing"

/******                                    */
/** Activity related error messages */
/******                                   */


/** Error message for getting activity */
msg.getActivity ="Unable to get activity"


/** Error message for adding activity */
msg.addActivity ="Unable to add activity"


/** Error message for editing activity */
msg.editActivity ="Unable to edit activity"


/** Error message for deleting activity */
msg.deleteActivity ="Unable to delete activity"

/** Error message for activity id */
msg.activityId ="Activity Id is missing"

export default msg;
