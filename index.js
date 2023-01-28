import {
  apolloClient,
  challenge,
  authenticate,
  refreshToken,
  verifyToken,
  publications,
  profiles,
  authApolloClient,
  follow,
  unfollow,
  ping,
  hasTransactionIndexed,
  userNotifications,
  createProfiel,
  profile,
  defaultProfile,
  publication,
  search,
  timeline,
  profileFeed,
} from "./query.js";

const address = "";
let signature;
let accessToken;
let refreshToken;

export const getChallenge = async () => {
  const { data } = await apolloClient.query({
    query: challenge,
    variables: {
      address,
    },
  });

  return data.challenge.text;
};

export const authenticateSig = async () => {
  const { data } = await authApolloClient.mutate({
    mutation: authenticate,
    variables: {
      address,
      signature,
    },
  });
  accessToken = data.authenticate.accessToken;
  refreshToken = data.authenticate.refreshToken;
  return data.authenticate;
};

export const getNewAccessToken = async () => {
  const { data } = await authApolloClient.mutate({
    mutation: refreshToken,
    variables: {
      refreshToken,
    },
  });

  accessToken = data.refresh.accessToken;

  return data.refresh;
};

export const verifyToken = async () => {
  const { data } = await apolloClient.query({
    query: verifyToken,
    variables: {
      refreshToken,
    },
  });

  return data.verify;
};

// export const
export const explorePublications = async () => {
  const { data } = await apolloClient.query({
    query: publications,
  });

  return data.explorePublications.items;
};

export const exploreProfiles = async () => {
  const { data } = await apolloClient.query({
    query: profiles,
  });

  return data.exploreProfiles.items;
};

export const followProfile = async (profile) => {
  const { data } = await authApolloClient.mutate({
    mutation: follow,
    variables: {
      profile,
    },
  });

  return data.createFollowTypedData;
};

export const unFollowProfile = async (profile) => {
  const { data } = await authApolloClient.mutate({
    mutation: unfollow,
    variables: {
      profile,
    },
  });

  return data.createUnfollowTypedData;
};

export const checkPing = async () => {
  const { data } = await apolloClient.query({
    query: ping,
  });

  return data;
};

export const checkTransactionIndexed = async (txId) => {
  const { data } = await apolloClient.query({
    query: hasTransactionIndexed,
    variables: {
      txId,
    },
  });

  return data;
};

export const getAllNotifications = async (profile) => {
  const { data } = await apolloClient.query({
    query: userNotifications,
    variables: {
      profile,
    },
  });

  return data;
};

export const createNewUser = async (handle) => {
  const { data } = await authApolloClient.mutate({
    mutation: createProfiel,
    variables: {
      handle,
    },
  });

  return data;
};

export const getDefaultProfile = async (address) => {
  const { data } = await apolloClient.query({
    query: defaultProfile,
    variables: {
      address,
    },
  });

  return data.defaultProfile;
};

export const getProfile = async (handle) => {
  const { data } = await apolloClient.query({
    query: profile,
    variables: {
      handle,
    },
  });

  return data.profile;
};

export const createPost = async (profile, contentURI) => {
  const { data } = await authApolloClient.mutate({
    mutation: post,
    variables: {
      profile,
      contentURI,
    },
  });

  return data;
};

export const createComment = async (profile, contentURI, publicationID) => {
  const { data } = await authApolloClient.mutate({
    mutation: post,
    variables: {
      profile,
      contentURI,
      publicationID,
    },
  });

  return data;
};

export const mirrorPost = async (profile, contentURI, publicationID) => {
  const { data } = await authApolloClient.mutate({
    mutation: post,
    variables: {
      profile,
      contentURI,
      publicationID,
    },
  });

  return data;
};

export const getPublication = async (publicationID) => {
  const { data } = await apolloClient.query({
    query: publication,
    variables: {
      publicationID,
    },
  });

  return data.publication;
};

// Can be PROFILE , POST , Comment
export const searchLens = async (query) => {
  const { data } = await apolloClient.query({
    query: search,
    variables: {
      query,
    },
  });

  return data.search.items;
};

export const getTimeline = async (profileID) => {
  const { data } = await apolloClient.query({
    query: timeline,
    variables: {
      profileID,
    },
  });

  return data.timeline.items;
};

export const getFeed = async (profileID) => {
  const { data } = await apolloClient.query({
    query: profileFeed,
    variables: {
      profileID,
    },
  });

  return data.feed.items;
};
