import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "../../App.css";
import { motion } from "framer-motion";

function FooterNav(){
    return(
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
<Container fluid className="bg-warning">
    <Row>
        <Col className="my-4 d-flex justify-content-center" xs={12} sm={12} md={6} lg={4}>
    <motion.div whileHover={{ scale: 1.05 }} className="d-flex flex-column gap-3">
            <img src='https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/Byteeats%20Profile%20Logo.png' className='footer-logimg'></img>
            <p>© 2025 ByteEats. All Rights Reserverd</p>
        <div className="d-flex gap-3 m-0 p-0 flex-nowrap">
            <img className="socialMedia-img" src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756874/Food%20Order%20Website/ja0asjyxu0ldj3in80ii.png"/>
            <img className="socialMedia-img" src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756877/Food%20Order%20Website/odsfiubj3iktczwzv0r9.png"/>
            <img className="socialMedia-img" src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/twitter%20icon.png"/>
        </div>
    </motion.div>
        </Col>
        <Col xs={12} sm={12} md={6} lg={4} >
        <div className="d-flex flex-column flex-nowrap">
            <p className="fs-5 fw-bold my-1">Pages</p>
         <p className="m-0 p-0"><a  className="text-decoration-none text-reset" href="/about">About Us</a></p>
         <p className="m-0 p-0"><a  className="text-decoration-none text-reset" href="/">News</a></p>
         <p className="m-0 p-0"><a  className="text-decoration-none text-reset" href="/">Contact</a></p>
         <p className="m-0 p-0"><a  className="text-decoration-none text-reset" href="/">Blog</a></p>
         <p className="m-0 p-0"><a  className="text-decoration-none text-reset" href="/">Terms & Condition</a></p>
         <p className="m-0 p-0"><a  className="text-decoration-none text-reset" href="/">Privacy Policy</a></p>
        </div>
        </Col>
        <Col xs={12} sm={12} md={6} lg={4}>
    <div className="d-flex flex-column flex-nowrap">
    <p className="fs-5 fw-bold my-1">Subscribe</p>
    <p>Simply enter your mail below:</p>
    <Form className="d-flex flex-row flex-nowrap gap-2">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control type="email" placeholder="Enter email" />
      </Form.Group>
      <motion.div whileHover={{ scale: 1.1 }}>
      <Button variant="primary" type="submit" className="mb-3">
        Submit
      </Button>
      </motion.div>
    </Form>
    <p>By subscribing, you agree to receive emails from us and acknowledge our Privacy Policy.</p>
    </div>
    </Col>
    </Row>
    <motion.div className="d-flex flex-row gap-lg-5 gap-md-2 gap-sm-1  flex-wrap justify-content-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
        <div className="d-flex flex-row gap-2">
        <img src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/call%20icon.png" className="footericon"/>
        <p><a  className="text-decoration-none text-reset" href="tel:+4733378901">+91 8075146088</a></p>
        </div>
        <div className="d-flex flex-row gap-2">
        <img src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756876/Food%20Order%20Website/rd8wg2muc25dmfdzp32z.png" className="footericon"/>
        <p><a className="text-decoration-none text-reset" href="mailto:manu06011998@gmail.com">byteeats@support.com</a></p>
        </div>
        <div className="d-flex flex-row gap-2">
        <img src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756875/Food%20Order%20Website/Location%20Icon.png" className="footericon"/>
        <p>Near Palayam, Thiruvananthapuram, Kerala
        695020</p>
        </div>
        <div className="d-flex flex-row gap-4">
    <p className="fs-5 fw-bold">Download App On</p>
    <motion.a href="/" whileHover={{ scale: 1.1 }}><img src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/u73vggn7vjp072jznxgw.png" className="socialMedia-img"/></motion.a>
    <motion.a href="/" whileHover={{ scale: 1.1 }}><img src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1740756873/Food%20Order%20Website/aw2fe2fhcfsamnsxbkn3.png" className="socialMedia-img"/></motion.a>
    </div>
    </motion.div>
    </Container>
</motion.div>
    )
}

export default FooterNav