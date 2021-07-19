import { useEffect, useState } from 'react'
import Prismic from '@prismicio/client'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'

import { Box } from '../src/components/Box'
import { MainGrid } from '../src/components/MainGrid'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet
} from '../src/lib/AlurakutCommons'

import { getPrismicClient } from '../src/services/prismic'

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

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  const [communities, setCommunities] = useState([])
  const [followers, setFollowers] = useState([])

  const githubUser = props.githubUser
  const favoritePeople = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  useEffect(async () => {
    const followersResponse = await fetch(
      `https://api.github.com/users/${githubUser}/followers`
    )
    const followersList = await followersResponse.json()

    setFollowers(followersList)
  }, [])

  useEffect(async () => {
    const prismic = getPrismicClient()

    const response = await prismic.query(
      [Prismic.predicates.at('document.type', 'community')],
      {
        fetch: [
          'community.uid',
          'community.title',
          'community.image_url',
          'community.creator_slug'
        ],
        pageSize: 100
      }
    )

    let communityList = []
    if (response) {
      response.results.map(item => {
        communityList.push({
          id: item.id,
          title: item.data.title[0].text,
          image: item.data.image_url[0].text,
          creator_slug: item.data.creator_slug[0].text
        })
      })
    }
    setCommunities(communityList)
  }, [])

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
          <ProfileRelationsBox title="Seguidores" items={followers} />
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

export async function getServerSideProps(cxt) {
  const cookies = nookies.get(cxt)
  const token = cookies.USER_TOKEN

  const { isAuthenticated } = await fetch(
    'https://alurakut.vercel.app/api/auth',
    {
      headers: {
        Authorization: token
      }
    }
  ).then(response => response.json())

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const { githubUser } = jwt.decode(token)

  return {
    props: {
      githubUser
    }
  }
}
