import styled from "styled-components";
import { Button } from "react-bootstrap";

const ActionButton = styled(Button)`
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

export default ActionButton;