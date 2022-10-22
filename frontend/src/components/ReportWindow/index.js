import { TextField, Button } from '@mui/material';

const submit = () => {
    //var submitted = 1;
}

const ReportWindow = ({  reportWindowCallback }) => {
    return <div>
      <TextField id="filled-basic" label="Enter 2-Digit Code" variant="filled" />
      
      <Button onClick={submit} variant="contained">Submit</Button>
    </div>
}

export default ReportWindow