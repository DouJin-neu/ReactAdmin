/**
 * save local data
 */
const USER_KEY = 'user_key'
export default{
    //save user data
    saveUser(user){
        localStorage.setItem(USER_KEY,JSON.stringify(user))
    },

    //get user
    getUser(){
        return JSON.parse(localStorage.getItem(USER_KEY || '{}'))
    },

    removeUser(){
        localStorage.removeItem(USER_KEY)
    } 
}