const EmailWindow = ({ emailAddressCallback }) => {
  return <div>
    <TextField required  id="filled-basic" label="Enter Your Email Address" variant="filled" />
    
    Text box for email address, call emailAddressCallback
  </div>
}
export default EmailWindow
