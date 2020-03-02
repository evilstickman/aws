let response;

const thundra = require("@thundra")();

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

// Larry gets clever!
exports.spanListenerLambdaHandler =  thundra(async (event, context) => {
    const FilteringSpanListener = thundra.listeners.FilteringSpanListener;
    const LatencyInjectorSpanListener = thundra.listeners.LatencyInjectorSpanListener;
    const StandardSpanFilterer = thundra.listeners.StandardSpanFilterer;
    const SpanFilter = thundra.listeners.SpanFilter;

    const filteringListener = new FilteringSpanListener();
    const filter = new SpanFilter();
    filter.className = 'AWS-Lambdas';
    filter.tags = {
       'aws.lambda.name': 'upstream-lambdas'
    }

    const filterer = new StandardSpanFilterer([filter]);

    const latencyInjectorSpanListenerConfig = {
        delay: 5000,
        injectOnFinish: true
    };

    const latencyInjectorSpanListener = new LatencyInjectorSpanListener(latencyInjectorSpanListenerConfig);
    filteringListener.listener = latencyInjectorSpanListener;
    filteringListener.spanFilterer = filterer;

    thundra.tracer().addSpanListener(filteringListener);
    console.log( "The Long Paw Of Larry Was Here" );
    try {
        response = buildResponse();
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
});