let response;

/*
 * Builds a basic response to be sent back to the caller
 */
buildResponse = () => {
    response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Normal operation succeeded!'
            })
        };
    return response;
};

/**
 * Basic function to return a standard response without chaos
 */
exports.lambdaHandler = async (event, context) => {
    try {
        response = buildResponse();
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
  
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}   

exports.chaoticLambdaHandler = async (event, context) => {
    try {
        // Larry strikes!
        await sleep(1000);
        response = buildResponse();
        response.body.larry = "Meets with Larry's Approval";
        console.log( "Meets with Larry's Approval" );
        
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
