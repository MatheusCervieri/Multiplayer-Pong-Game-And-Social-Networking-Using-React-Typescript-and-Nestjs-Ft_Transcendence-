import axios from 'axios';
import React, { useEffect, useState } from 'react';
import  instance, { serverurl } from '../../confs/axios_information';
import styled from 'styled-components';
import Modal from 'react-modal';
import SetNameMyPerfil from './SetNameMyPerfil';
import SetProfileImageMyProfile from './SetProfileImageMyPerfil';
import TwoFa from '../../login_setup/2fa/TwoFaEnable'

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 16px;
`;

const EditButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-left: 8px;
  cursor: pointer;
`;

const UserName = styled.p`
  font-size: 24px;
  font-weight: bold;
`;

const UserInfoItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0;
`;

const UserInfoLabel = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-right: 16px;
`;

const MatchHistoryWrapper = styled.div`
  margin-top: 0px;
  background-color: #f2f2f2;
  padding: 16px;
  border-radius: 4px;
  text-align: center;
`;

const MatchHistoryTitle = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const MatchHistoryList = styled.ul`
  list-style: none;
  padding: 0;
`;

const MatchHistoryItem = styled.li`
    font-size: 18px;
    margin-bottom: 8px;
    border: 2px solid #ccc;
    border-radius: 4px;
    padding: 8px;

    &.winner {
    border-color: green;
    }

    &.loser {
      border-color: red;
    }

`;

const customModalStyles = {
  content: {
    width: '30%',
    height: '30%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
};

const CustomModal = styled(Modal)`
  .ReactModal__Overlay {
    opacity: 0;
    transition: opacity 200ms ease-in-out;
  }

  .ReactModal__Overlay--after-open {
    opacity: 1;
  }

  .ReactModal__Overlay--before-close {
    opacity: 0;
  }

  .ReactModal__Content {
    ${customModalStyles.content}
  }

  @media (max-width: 768px) {
    .ReactModal__Content {
      width: 80%;
      height: 50%;
    }
  }
`;

const MyPerfil: React.FC = () => {
  const [userInformation, setUserInformation] = useState<any>([]);
  const [matchHistory, setMatchHistory] = useState<any[]>([]);
  const [isChangeNameOpen, setChangeNameOpen] = useState(false);
  const [isPictureModalOpen, setPictureModalOpen] = useState(false);
  const [isTwoFaModalOpen , setTwoFaModalOpen] = useState(false);

  function getUserInformation()
  {
    const token = localStorage.getItem('token');
    instance.get('userdata/myprofile' , {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then((response: any) => {
      console.log(response.data);
      console.log(response.data.id);
      setUserInformation(response.data);
      getMatchHistory(response.data.name);
    })
    .catch((error : any) => {
      console.error(error);
    });
  }
  useEffect(() => {
    getUserInformation();
  }, []);

  async function getMatchHistory(name : string){
    const token = localStorage.getItem('token');
    axios.get(serverurl + '/games/history/' + name,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then((response : any) => {
      console.log(response.data);
      setMatchHistory(response.data);
    })
    .catch((error : any) => {
      console.log(error);
    });
  }



  const handlePictureEdit = () => {
    setPictureModalOpen(true);
  };

  const togglePictureModal = () => {
    setPictureModalOpen(false);
    getUserInformation();
  }

  const handleNameEdit = () => {
    // Handle name edit here
    setChangeNameOpen(true);
   
  };

  const toggleNameModal = () => {
    setChangeNameOpen(false);
    getUserInformation();
  }

  const handleTwoFa = () => {
    setTwoFaModalOpen(true);
  };
  
  const toggleTwoFaModal = () => {
    setTwoFaModalOpen(false);
  }
 
    

  return (
    <UserInfoWrapper>
      <ProfileImage src={serverurl + "/publicimage/profileimage/" + userInformation.id} alt="Player" />
      <EditButton onClick={handlePictureEdit}>Edit Picture</EditButton>
      <UserName>{userInformation.name}</UserName>
      <CustomModal isOpen={isChangeNameOpen} onRequestClose={toggleNameModal}>
        <SetNameMyPerfil closeModal={toggleNameModal}/>
      </CustomModal>
      <CustomModal  isOpen={isPictureModalOpen} onRequestClose={togglePictureModal}>
        <SetProfileImageMyProfile closeModal={toggleNameModal}/>
      </CustomModal>
      <CustomModal  isOpen={isTwoFaModalOpen} onRequestClose={toggleTwoFaModal}>
        <TwoFa closeModal={toggleTwoFaModal} ></TwoFa>
      </CustomModal>
      <EditButton onClick={handleNameEdit}>Edit Name</EditButton>
      <UserInfoItem>
        <UserInfoLabel>Wins:</UserInfoLabel>
        <p>{userInformation.wins}</p>
      </UserInfoItem>
      <UserInfoItem>
        <UserInfoLabel>Loses:</UserInfoLabel>
        <p>{userInformation.losts}</p>
      </UserInfoItem>
      <UserInfoItem>
        <UserInfoLabel>Ranking:</UserInfoLabel>
        <p>{userInformation.rankingP}</p>
      </UserInfoItem>
      <EditButton onClick={handleTwoFa}>TwoFa Configuracion</EditButton>
      <MatchHistoryWrapper>
        <MatchHistoryTitle>Match History</MatchHistoryTitle>
        <MatchHistoryList>
        {matchHistory.map((match, index) => {
        const [player1Name, player2Name] = match.name.split(" vs ");
        if (match.winnerId === userInformation.id) {
          return (
            <MatchHistoryItem key={index} className="winner">
               {player1Name} ({match.player1FinalScore}) vs {player2Name} ({match.player2FinalScore})
            </MatchHistoryItem>
          );
        } else if (match.looserId === userInformation.id) {
          return (
            <MatchHistoryItem key={index} className="loser">
              {player1Name} ({match.player1FinalScore}) vs {player2Name} ({match.player2FinalScore})
            </MatchHistoryItem>
          );
        } else {
          return (
            <MatchHistoryItem key={index}>
              {match.name}
            </MatchHistoryItem>
          );
        }
      })}
        </MatchHistoryList>
      </MatchHistoryWrapper>
    </UserInfoWrapper>
  );
};

export default MyPerfil;