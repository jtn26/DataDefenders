const EmailWindow = ({ emailAddressCallback }) => {
  
  // handleOnChange = event => {
  //   console.log('Click');
  //   console.log(event.target.value);
  // };
  // onChange={this.handleOnChange}
  
  return <div>
    <TextField required  id="filled-basic" label="Enter Your Email Address" variant="filled" />
    
    call emailAddressCallback
  </div>
}
export default EmailWindow
