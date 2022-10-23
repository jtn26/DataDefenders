import { Box, Table, IconButton,
  TableBody, TableCell, TableContainer, TableHead, TableFooter, 
  TablePagination, TableRow, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles';
import LastPageIcon from '@mui/icons-material/LastPage'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import { PropTypes } from 'prop-types'
import { getAllReports } from '../../shared/api';
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';


//ADD KNOWN URLS AND COUNT TO TABLE


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};


function DataTable() {
  const [rows, setRows] = useState([]);
  useEffect(async () => {
    console.log('getting data')
    const reports = await getAllReports()
    const formattedReports = reports.map(report => { return { site: report.url, reportCount: report.reports } })
    const sortedReports = formattedReports.sort((a, b) => b.reportCount - a.reportCount)
    setRows(formattedReports)
    const pieLabels = sortedReports.filter(x => x.reportCount>0).map(report => report.site)
    const pieData = sortedReports.filter(x => x.reportCount>0).map(report => report.reportCount)
    // console.log(pieLabels)
    // console.log(pieData)
    setPieData([{data: pieData, backgroundColor: pieData.map(_ => getRandomColor())}])
    setPieLabels(pieLabels)
  }, [getAllReports])

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pieLabels, setPieLabels] = useState([])
  const [pieData, setPieData] = useState([])
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', maxWidth: '100%' }}>

    <TableContainer sx={{ minWidth: 500, maxWidth:'60%' }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Site</b></TableCell>
            <TableCell align="right"><b># Reports</b></TableCell>
          </TableRow>
        </TableHead>
        
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.site}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.reportCount}
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    <div style={{marginLeft: '5%', width:"40vh",position:"relative", marginBottom:"1%", padding:"1%"}}>
      <Pie
      width="40%"
      options={{ maintainAspectRatio: false }}
      data={{
        labels: pieLabels,
        datasets: pieData
      }}
      />
    </div>
    </Box>
  );
}

export default DataTable