import validator from "validator";

const validate = (fullname,mobile,email,password,role) => {
    const errors = [];
    const validRoles = ['user', 'admin', 'rider'];

    if(!fullname || fullname.trim().length < 2)
    {
        errors.push({message: "Invalid Fullname"});
    }

    if(!mobile || !validator.isMobilePhone(mobile,'en-IN'))
    {
        errors.push({message: "Invalid Mobile Number"});
    }

    if(!email || !validator.isEmail(email))
    {
        errors.push({message: "Invalid Email Address"});
    }

    if(!password || !validator.isStrongPassword(password, {minLength: 8,minUppercase: 1, minNumbers: 1,minSymbols: 1}))
    {
        errors.push({message: "Invalid Password"});
    }
    
    if (!role || validRoles.includes(role.toLowerCase())) {
        errors.push({ message: "Invalid Role" });
    }
    
    if(errors.length > 0)
    {
        return {isValid: false, errors}
    }

    return {isValid: true,errors}
}

export default validate;