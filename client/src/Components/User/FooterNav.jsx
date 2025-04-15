import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../Axios/axiosInstance.js";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaApple,
  FaGooglePlay
} from "react-icons/fa";

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #ffc107 0%,rgb(101, 101, 101) 100%);
  color: white;
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  position: relative;
  z-index: 2;
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoContainer = styled.div`
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const Logo = styled.img`
  height: 40px;
  filter: brightness(0) invert(1);
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => 
      props.$platform === 'facebook' ? '#3b5998' : 
      props.$platform === 'twitter' ? '#1da1f2' : 
      '#e1306c'};
    transform: translateY(-3px);
  }
`;

const ColumnTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 2px;
    background: #4cc9f0;
  }
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  margin-bottom: 0.8rem;
  transition: all 0.3s ease;
  display: inline-block;

  &:hover {
    color: white;
    transform: translateX(5px);
  }
`;

const SubscribeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EmailInput = styled.input`
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background: #4cc9f0;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ContactIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const AppLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const AppLink = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: white;
  text-decoration: none;
  font-size: 0.8rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Message = styled(motion.div)`
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled(Message)`
  background: rgba(76, 201, 240, 0.2);
  color: #4cc9f0;
`;

const ErrorMessage = styled(Message)`
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 3rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

function FooterNav() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/subscribe/create", { email });
      setMessage("Thank you for subscribing!");
      setEmail("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setMessage("This email is already subscribed");
      setShowSuccess(false);
    }
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <LogoContainer>
            <Logo 
              src="https://res.cloudinary.com/dzmymp0yf/image/upload/v1743949318/Food%20Order%20Website/New%20Image%20for%20login/zjbubfxtliury2rhjoif.png" 
              alt="ByteEats Logo" 
            />
          </LogoContainer>
          <Copyright>© 2025 ByteEats. All Rights Reserved</Copyright>
          <SocialIcons>
            <SocialIcon $platform="facebook" href="#">
              <FaFacebookF />
            </SocialIcon>
            <SocialIcon $platform="twitter" href="#">
              <FaTwitter />
            </SocialIcon>
            <SocialIcon $platform="instagram" href="#">
              <FaInstagram />
            </SocialIcon>
          </SocialIcons>
        </FooterColumn>

        <FooterColumn>
          <ColumnTitle>Quick Links</ColumnTitle>
          {["About Us", "News", "Contact", "Blog", "Terms & Conditions", "Privacy Policy"].map((page, i) => (
            <FooterLink key={i} href="#">{page}</FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn>
          <ColumnTitle>Contact Us</ColumnTitle>
          <ContactItem>
            <ContactIcon>
              <FaPhoneAlt size={14} />
            </ContactIcon>
            <a href="tel:+918075146088" style={{color: 'inherit', textDecoration: 'none'}}>+91 8075146088</a>
          </ContactItem>
          <ContactItem>
            <ContactIcon>
              <FaEnvelope size={14} />
            </ContactIcon>
            <a href="mailto:byteeats@support.com" style={{color: 'inherit', textDecoration: 'none'}}>byteeats@support.com</a>
          </ContactItem>
          <ContactItem>
            <ContactIcon>
              <FaMapMarkerAlt size={14} />
            </ContactIcon>
            <span>Near Palayam, Thiruvananthapuram, Kerala 695020</span>
          </ContactItem>
        </FooterColumn>

        <FooterColumn>
          <ColumnTitle>Newsletter</ColumnTitle>
          <p style={{color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem'}}>
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <SubscribeForm onSubmit={handleSubscribe}>
            <EmailInput
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <SubmitButton 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
            >
              Subscribe
            </SubmitButton>
            <AnimatePresence>
              {showSuccess ? (
                <SuccessMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {message}
                </SuccessMessage>
              ) : message ? (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {message}
                </ErrorMessage>
              ) : null}
            </AnimatePresence>
          </SubscribeForm>
          <p style={{color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem', marginTop: '1rem'}}>
            By subscribing, you agree to our Privacy Policy.
          </p>
        </FooterColumn>
      </FooterContent>

      <FooterBottom>
        <p style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem'}}>
          Delivering deliciousness to your doorstep since 2023
        </p>
        <AppLinks>
          <AppLink 
            href="#" 
            whileHover={{ y: -3 }}
          >
            <FaApple size={18} />
            <span>App Store</span>
          </AppLink>
          <AppLink 
            href="#" 
            whileHover={{ y: -3 }}
          >
            <FaGooglePlay size={16} />
            <span>Google Play</span>
          </AppLink>
        </AppLinks>
      </FooterBottom>
    </FooterContainer>
  );
}

export default FooterNav;
