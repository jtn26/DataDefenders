import { TextField} from '@mui/material';


function Dashboard() {
  var userEmail = "example@gmail.com"

  return <div> 
    <TextField required defaultValue={userEmail} id="filled-basic" label="Filled" variant="filled" />

    

    
  </div>
}






export default Dashboard