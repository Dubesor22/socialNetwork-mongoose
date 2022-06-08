module.exports = {
    components:{
        schemas:{
            user:{
                type:'object',
                properties:{
                    _id:{
                        type:'objectId',
                        description:"user identification number",
                        example:"6201064b0028de7866e2b2c4"
                    },
                    username:{
                        type:'string',
                        description:"the name of the user",
                        example:"juan"
                    },
                    email:{
                        type:'string',
                        description:"email",
                        example:"juan@gmail.com"
                    },
                    completed:{
                        type:"boolean",
                        description:"The status of the task",
                        example:false
                    }
                }
            }
        }
    }
}
