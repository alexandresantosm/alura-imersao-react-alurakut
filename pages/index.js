import { useState } from 'react'

import { Box } from '../src/components/Box'
import { MainGrid } from '../src/components/MainGrid'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet
} from '../src/lib/AlurakutCommons'

function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${props.githubUser}.png`}
        alt={`Foto do usuário no github ${props.githubUser}`}
        style={{ borderRadius: '8px' }}
      />
      <hr />
      <p>
        <a
          href={`https://github.com/${props.githubUser}`}
          className="boxLink"
          target="_blank"
        >
          @{props.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

export default function Home() {
  const [communities, setCommunities] = useState([
    {
      title: 'Alurakut',
      image: 'https://i.ytimg.com/vi/5vmPPJh7Ww8/maxresdefault.jpg'
    },
    {
      title: 'Eu odeio acordar cedo',
      image: 'https://pbs.twimg.com/profile_images/143696361/avatar_400x400.jpg'
    }
  ])

  const githubUser = 'alexandresantosm'
  const favoritePeople = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  function handleCreateComunity(event) {
    event.preventDefault()
    const formDatas = new FormData(event.target)
    const community = {
      title: formDatas.get('title'),
      image: formDatas.get('image')
    }

    setCommunities([...communities, community])
  }

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />

      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem-vindo(a), Alexandre</h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={() => handleCreateComunity(event)}>
              <div>
                <input
                  type="text"
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>Criar cominudade</button>
            </form>
          </Box>
        </div>

        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Meus amigos ({favoritePeople.length})
            </h2>
            <ul>
              {favoritePeople.map((item, index) => (
                <li key={index}>
                  <a href={`/users/${item}`}>
                    <img
                      src={`https://github.com/${item}.png`}
                      alt={`Foto do usuário no github ${item}`}
                    />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Minhas comunidades ({communities.length})
            </h2>
            <ul>
              {communities.map((item, index) => (
                <li key={index}>
                  <a href={`/users/${item.title}`}>
                    <img
                      src={item.image}
                      alt={`Foto da comunidade ${item.title}`}
                    />
                    <span>{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
