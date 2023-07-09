export interface ListItemProps{
    // id:string, //list index
    json:{
        hw_id:string,
        label:string,
        HW_updates:{
            m?: {
                i?:any,
                c?:any
          },
            s?: {
                i?: any,
                c?: any
          }
        },
        last_update?:string
      }
}

export default ListItemProps