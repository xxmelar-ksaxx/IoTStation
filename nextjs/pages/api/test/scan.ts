import { Scan_For_Devices } from '@/onStartUp/localDevicesScan';

export default async function handler(req:any, res:any) {
    Scan_For_Devices()
    const msg={"test->":"ok"}
    res.status(200).json(msg);
}