import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom';
import './css/HomePage.css'
import '../components/css/globalStyles.css'
import Button from '../components/Button';
import ListItem from '../components/ListItem';
import AddDeviceForm from '../components/AddDeviceForm';
import { logout } from '../actions/auth';
import { get_devices } from '../actions/devices';
import { has_update } from '../actions/devices';
import { connect } from 'react-redux';

// icons Libs
import { TbHome } from "react-icons/tb";
import { BiUser } from "react-icons/bi";
import { AiOutlineSetting } from "react-icons/ai";
import { MdAdd } from "react-icons/md";

const HomePage = ({isAuthenticated, logout, get_devices, has_update}) => {
    
    const navigate = useNavigate();

    const [gstate, setgstate]= useState(0);
    const [rstate, setrstate]= useState(1);

    const [isLodead, setIsLodead] = useState(false);
    const [itemsDic, setItemsDic] = useState({});

    const [firstCall,setfirstCall]=useState(true);
    const [allDevs,setAllDevs]=useState({});
    const [hasUpdateDate,setHasUpdateDate]=useState('1122');
    
    // add new devices form visiblity
    const [isAddDevice,setIsAddDevice]=useState(false);


    const testfunc=(v)=>{
        setgstate(v);
    }
    
  

    function gotoLogin(){
        // history stack gets replaced with the new one, when replace = true.
        navigate('/login', {replace: true}); 
    }
    function addDeviceForm(){
        alert('Add Device Clicked');
        // <AddDeviceForm/>
        // document.appendChild(<AddDeviceForm/>);


    }

    // for testing purposes only
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const createDicItem=(dic, label)=>{
        let randomString=makeid(6);
        dic[randomString]={name:label,key:randomString,hasupdate:false};
        return dic;
    }

    const createTheDic = () => {
        let mainDic={};
        mainDic=createDicItem(mainDic,'Appel');
        mainDic=createDicItem(mainDic,'Car');
        mainDic=createDicItem(mainDic,'Home');
        // console.table(mainDic);

        return mainDic;
    }

    
    const dic={
        'ax1':{name:'Apple'},
        'ax2':{name:'Apricot'},
        'ax3':{name:'Honeyberry'},
        'ax4':{name:'Papaya'},
        'ax5':{name:'Jambul'}
    }

    
    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
    );

    function printDic(dic){
        console.log('hello')
        for (let key in itemsDic) {
            console.log(itemsDic[key])
        }
       
    }
    
    async function ListSetup(){
        if(!isLodead){
            setIsLodead(true)
            setItemsDic(createTheDic());
            setrstate(2)

        }
    }

    async function get_all_devices(){
        let res= await get_devices()
        return res.devices
    }

    async function check_has_update(data){
        let res = await has_update(data);
        return res
    }

    async function first_call_get_device(){
        setfirstCall(false);
        setAllDevs(await get_all_devices());
    }

    // has_update
    

    useEffect(() => {
        ListSetup()
        // printDic(itemsDic)
        // console.log('rstate: ',rstate)
        if(firstCall){
            first_call_get_device();    
        }
        const interval = setInterval(async () => {
            // console.log('This will run every second!');
            // console.log(allDevs)
            let has_update = await check_has_update(hasUpdateDate)
            if((has_update.update)){
                setAllDevs(await get_all_devices());
                setHasUpdateDate(has_update.date)
                console.log('got some updates !!');
            }

          }, 100); // ms
          return () => clearInterval(interval);

    });

    
    
    const displayItems=()=>{
        let listData=[]
        for(let key in itemsDic) {
            // console.log(itemsDic[key])
            listData.push(<ListItem dicItems={itemsDic[key]} getdic={itemsDic} setdic={setItemsDic} gstate={gstate} setgstate={setgstate} testfunc={testfunc} />)
        }
        return listData;
    }
    
    const displayItems_2 = ()=>{
        let listData=[]
        // let allDevices = allDevs
        // console.table(allDevices)

        // for(let key in allDevices) {
        //     console.log(allDevices[key])
        // }
        for(let key in allDevs) {
            listData.push(<ListItem theItem={allDevs[key]}/>)
        }
        return listData;
    }
    
    const open_add_new_device=()=>{
        setIsAddDevice(true)
    }

    const close_add_new_device=(e)=>{
        if(e.currentTarget == e.target){
            setIsAddDevice(false);
        }
    }

    const getIsAddDevice=()=>{
        if(!isAddDevice){return 'none'}
        return '';
    }

    return (
        <div className="center">
            <div style={{display:getIsAddDevice()}}><AddDeviceForm bgOnClick={(e)=>{close_add_new_device(e)}} setIsAddDevice={setIsAddDevice}/></div>
            <div className='home-heading-continer'>
            <div className='width-100 hover-pointer' ><AiOutlineSetting size="33px" color="#ECDBBA"  onClick={() => navigate('/Setting_Page', {replace: true})}/></div>
                <div className='width-100'><h1 className="page-title">Devices</h1></div>
                <div className='width-100 hover-pointer' ><MdAdd size="33px" color="#ECDBBA" onClick={open_add_new_device}/></div>
            </div>
           
            

            {/* list of items continer */}
            <div className="divcenter">
                {displayItems_2()}
            </div>
            
        </div>
    );

}

// export default HomePage();
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout, get_devices, has_update })(HomePage);