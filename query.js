import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { gql } from "@apollo/client";

const APIURL = "https://api-mumbai.lens.dev/";

export const apolloClient = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

const httpLink = new HttpLink({ uri: "https://api-mumbai.lens.dev/" });

const authLink = new ApolloLink((operation, forward) => {
  const token = "";
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });

  return forward(operation);
});

export const authApolloClient = new ApolloClient({
  uri: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const challenge = gql`
  query Challenge($address: EthereumAddress!) {
    challenge(request: { address: $address }) {
      text
    }
  }
`;

export const authenticate = gql`
  mutation Authenticate($address: EthereumAddress!, $signature: Signature!) {
    authenticate(request: { address: $address, signature: $signature }) {
      accessToken
      refreshToken
    }
  }
`;

export const refreshToken = gql`
  mutation Refresh($refreshToken: RefreshToken!) {
    refresh(request: { refreshToken: $refreshToken }) {
      accessToken
      refreshToken
    }
  }
`;

export const verifyToken = gql`
  query Query($accessToken: AccessToken!) {
    verify(request: { accessToken: $accessToken })
  }
`;

/// Sorting can be TOP_COMMENTED , TOP_COLLECTED , TOP_MIRRORED ,LATEST , CurateProfule
export const publications = gql`
  query ExplorePublications {
    explorePublications(
      request: {
        sortCriteria: TOP_COMMENTED
        publicationTypes: [POST, COMMENT, MIRROR]
        limit: 10
      }
    ) {
      items {
        __typename
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;

/// Sorting on basis of CREATED_ON , MOST_FOLLOWERS , LATEST_CREATED , MOST_POSTS, MOST_COMMENTS, MOST_MIRRORS , MOST_PUBLICATIONS, MOST_COLLECTS
export const profiles = gql`
  query ExploreProfiles {
    exploreProfiles(request: { sortCriteria: MOST_FOLLOWERS }) {
      items {
        id
        name
        bio
        isDefault
        attributes {
          displayType
          traitType
          key
          value
        }
        followNftAddress
        metadata
        handle
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            chainId
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
        }
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            chainId
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
        }
        ownedBy
        dispatcher {
          address
          canUseRelay
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
            type
            contractAddress
            amount {
              asset {
                name
                symbol
                decimals
                address
              }
              value
            }
            recipient
          }
          ... on ProfileFollowModuleSettings {
            type
          }
          ... on RevertFollowModuleSettings {
            type
          }
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;

export const follow = gql`
  mutation CreateFollowTypedData($profile: Profile!) {
    createFollowTypedData(
      request: { follow: [{ profile: $profile, followModule: null }] }
    ) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          FollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          datas
        }
      }
    }
  }
`;

export const unfollow = gql`
  mutation CreateUnfollowTypedData($profile: Profile!) {
    createUnfollowTypedData(request: { profile: $profile }) {
      id
      expiresAt
      typedData {
        types {
          BurnWithSig {
            name
            type
          }
        }
        domain {
          version
          chainId
          name
          verifyingContract
        }
        value {
          nonce
          deadline
          tokenId
        }
      }
    }
  }
`;

export const following = gql``;

export const follwers = gql``;

export const isFollowedByMe = gql``;

export const isFollowing = gql``;

export const ping = gql`
  query Query {
    ping
  }
`;

export const hasTransactionIndexed = gql`
  query HasTxHashBeenIndexed($transaction: Transaction!) {
    hasTxHashBeenIndexed(request: { txHash: $transaction }) {
      ... on TransactionIndexedResult {
        indexed
        txReceipt {
          to
          from
          contractAddress
          transactionIndex
          root
          gasUsed
          logsBloom
          blockHash
          transactionHash
          blockNumber
          confirmations
          cumulativeGasUsed
          effectiveGasPrice
          byzantium
          type
          status
          logs {
            blockNumber
            blockHash
            transactionIndex
            removed
            address
            data
            topics
            transactionHash
            logIndex
          }
        }
        metadataStatus {
          status
          reason
        }
      }
      ... on TransactionError {
        reason
        txReceipt {
          to
          from
          contractAddress
          transactionIndex
          root
          gasUsed
          logsBloom
          blockHash
          transactionHash
          blockNumber
          confirmations
          cumulativeGasUsed
          effectiveGasPrice
          byzantium
          type
          status
          logs {
            blockNumber
            blockHash
            transactionIndex
            removed
            address
            data
            topics
            transactionHash
            logIndex
          }
        }
      }
      __typename
    }
  }
`;

export const allNFTs = gql`
  query Nfts($address: Address!) {
    nfts(request: { ownerAddress: $address, limit: 10, chainIds: [1] }) {
      items {
        contractName
        contractAddress
        symbol
        tokenId
        owners {
          amount
          address
        }
        name
        description
        contentURI
        originalContent {
          uri
          metaType
        }
        chainId
        collectionName
        ercType
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;

export const userNotifications = gql`
  query Notifications($profile: Profile!) {
    result: notifications(request: { profileId: $profile, limit: 10 }) {
      items {
        ... on NewFollowerNotification {
          notificationId
          ...NewFollowerNotificationFields
        }

        ... on NewMirrorNotification {
          notificationId
          ...NewMirrorNotificationFields
        }

        ... on NewCollectNotification {
          notificationId
          ...NewCollectNotificationFields
        }

        ... on NewCommentNotification {
          notificationId
          ...NewCommentNotificationFields
        }

        ... on NewMentionNotification {
          notificationId
          ...NewMentionNotificationFields
        }
        ... on NewReactionNotification {
          notificationId
          ...NewReactionNotificationFields
        }
      }
      pageInfo {
        ...CommonPaginatedResultInfo
      }
    }
  }
`;

export const createProfiel = gql`
  mutation CreateProfile($handle: Handle!) {
    createProfile(
      request: {
        handle: $handle
        profilePictureUri: null
        followNFTURI: null
        followModule: null
      }
    ) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
      __typename
    }
  }
`;

export const defaultProfile = gql`
  query DefaultProfile($address: EthereumAddress!) {
    defaultProfile(request: { ethereumAddress: $address }) {
      id
      name
      bio
      isDefault
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      handle
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          chainId
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
      }
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          chainId
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          contractAddress
          amount {
            asset {
              name
              symbol
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
          type
        }
        ... on RevertFollowModuleSettings {
          type
        }
      }
    }
  }
`;

export const profile = gql`
  query Profile($handle: Handle) {
    profile(request: { handle: $handle }) {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      isDefault
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
          type
        }
        ... on RevertFollowModuleSettings {
          type
        }
      }
    }
  }
`;

export const post = gql`
  mutation CreatePostTypedData($profile: Profile!, $contentURI: ContentURI!) {
    createPostTypedData(
      request: {
        profileId: $profile
        contentURI: $contentURI
        collectModule: { revertCollectModule: true }
        referenceModule: { followerOnlyReferenceModule: false }
      }
    ) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`;

export const comment = gql`
  mutation CreateCommentTypedData(
    $profile: Profile!
    $contentURI: ContentURI!
    $publicationId: PublicationId!
  ) {
    createCommentTypedData(
      request: {
        profileId: $profile
        publicationId: $publicationId
        contentURI: $contentURI
        collectModule: { revertCollectModule: true }
        referenceModule: { followerOnlyReferenceModule: false }
      }
    ) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          profileIdPointed
          pubIdPointed
          contentURI
          referenceModuleData
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`;

export const mirror = gql`
  mutation CreateMirrorTypedData(
    $profile: Profile!
    $publicationId: PublicationId!
  ) {
    createMirrorTypedData(
      request: {
        profileId: $profile
        publicationId: $publicationId
        referenceModule: { followerOnlyReferenceModule: false }
      }
    ) {
      id
      expiresAt
      typedData {
        types {
          MirrorWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          profileIdPointed
          pubIdPointed
          referenceModule
          referenceModuleData
          referenceModuleInitData
        }
      }
    }
  }
`;

export const publication = gql`
  query Publication($publicationId: PublicationId!) {
    publication(request: { publicationId: $publicationId }) {
      __typename
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
      ... on Mirror {
        ...MirrorFields
      }
    }
  }
`;

// Can be UPVOTE & DOWNVOTE
export const addRx = gql`
  mutation AddReaction($profile: Profile!, $publicationId: PublicationId!) {
    addReaction(
      request: {
        profileId: $profile
        reaction: UPVOTE
        publicationId: $publicationId
      }
    )
  }
`;

// type could be PROFILE , POST & COMMENT
export const search = gql`
  query Search($query: Query!) {
    search(request: { query: $query, type: PROFILE, limit: 10 }) {
      ... on ProfileSearchResult {
        __typename
        items {
          ... on Profile {
            ...ProfileFields
          }
        }
        pageInfo {
          prev
          totalCount
          next
        }
      }
    }
  }
`;

export const timeline = gql`
  query Timeline($profile: Profile!) {
    timeline(request: { profileId: $profile, limit: 10 }) {
      items {
        __typename
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;

export const profileFeed = gql`
  query Feed($profile: Profile!) {
    feed(request: { profileId: $profile, limit: 50 }) {
      items {
        root {
          ... on Post {
            ...PostFields
          }

          ... on Comment {
            ...CommentFields
          }
        }
        electedMirror {
          mirrorId
          profile {
            id
            handle
          }
          timestamp
        }
        mirrors {
          profile {
            id
            handle
          }
          timestamp
        }
        collects {
          profile {
            id
            handle
          }
          timestamp
        }
        reactions {
          profile {
            id
            handle
          }
          reaction
          timestamp
        }
        comments {
          ...CommentFields
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;
