import print from 'graphql';

class LoggingExtension {
  requestDidStart({queryString, parsedQuery, variables}) {
    const query = queryString || print(parsedQuery);
    // TODO: Replace with Winston
    console.log('Client Query:', query);
    console.log('Query Variables:', variables);
  }

  willSendResponse({graphqlResponse}) {
    // TODO: Replace with Winston
    console.log('Response:', JSON.stringify(graphqlResponse, null, 2));
  }
}

export default LoggingExtension;