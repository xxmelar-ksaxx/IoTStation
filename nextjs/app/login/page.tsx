'use client'
import Input from '../components/Fields/Input'
import Button from '../components/Button/Button'

const login=()=>{
    return(
        <div className="flex flex-col items-center">
            <div>Login</div>
            <Input 
                lable="Email" 
                placeholder="Enter email" 
                className='my-2' 
                LclassName='pl-1' />
            <Input 
                lable="Password" 
                placeholder="Enter password" 
                className='mb-4' 
                LclassName='pl-1' />
            <Button 
                lable='Login' 
                className='LoginButton'/>
        </div>
    )
}
export default login