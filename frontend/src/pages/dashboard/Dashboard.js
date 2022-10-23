import './index.css';
import DataTable from '../../components/Table'
import { Box } from '@mui/material';
import Header from '../../components/Header';


function Dashboard() {
  
  return <div> 
    <Header />
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 4, ml: 4, mt: 4 }}>
      <DataTable />
    </Box>
  </div>
}



export default Dashboard