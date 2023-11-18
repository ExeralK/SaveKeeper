import styled from "@emotion/styled";
import { primary, light, secondary, dark, grey } from "../../theme/colors";

export const Sidebar = styled.div`
  flex: 1 1 0;
  color: ${light};
  background-color: ${secondary};
`;

export const SidebarTitle = styled.h2`
  font-size: 30px;
  letter-spacing: 1px;
  text-align: center;
  padding: 10px 0;
`;

export const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const SidebarItem = styled.li`
  font-size: 20px;
  letter-spacing: 0.5px;
  padding: 20px 20px;
  border-left: 5px solid transparent;

  &.is-active {
    background-color: rgba(235, 204, 101, 0.2);
    border-left: 5px solid ${primary};
  }

  &:hover {
    cursor: pointer;
  }

  span {
    padding-left: 10px;
  }
`;

export const WrapperPage = styled.div`
  padding: 0 40px;
  background-color: ${dark};
  height: 100%;
`;

export const ContentPage = styled.div`
  margin-top: 20px;
  background-color: ${secondary};
  color: ${light};
  padding: 20px;
  border-radius: 10px;
`;

export const TitlePage = styled.h2`
  font-size: 40px;
  letter-spacing: 1px;
  color: ${grey};
  padding-top: 50px;
  margin: 0;
`;

export const MainAreaContainer = styled.div`
  display: flex;
  height: 100vh;

  .main-content {
    flex: 3 1 0;
  }
`;
