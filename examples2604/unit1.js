async function doGenerateWithAi(context) {
    var _selectValue_2, ai, aiResponse, diagram, error, ex, fakeai, prompt, promptLines, responseObj, userRequest;
    try {
        ai = {
            provider: context.provider.value,
            key: trim(context.key.value),
            name: trim(context.name.value),
            model: trim(context.model.value),
            description: trim(context.description.value)
        };
        html.setText(context.error, '');
        error = '';
        if (ai.provider) {
            if (ai.model) {
                if (ai.key) {
                    if (ai.name) {
                        if (!ai.description) {
                            context.description.focus();
                            error = tr('Description is empty');
                        }
                    } else {
                        context.name.focus();
                        error = tr('Name is empty');
                    }
                } else {
                    context.key.focus();
                    error = tr('API key is empty');
                }
            } else {
                context.model.focus();
                error = tr('Model is empty');
            }
        } else {
            error = tr('AI provider is empty');
        }
        if (error) {
            html.setText(context.error, error);
        } else {
            saveAiDialogData(ai);
            promptLines = window.drakonhub_prompts.getCreateDrakonPrompt();
            prompt = promptLines.join('\n');
            userRequest = '## ' + ai.name + '\n\n' + ai.description;
            console.log(prompt, userRequest);
            fakeai = false;
            _selectValue_2 = ai.provider;
            if (_selectValue_2 === 'openai') {
                showWait();
                if (fakeai) {
                    responseObj = generateFakeAiResponse();
                } else {
                    responseObj = await sendRequestToOpenAi(ai.key, ai.model, prompt, userRequest);
                }
                hideWait();
                if (responseObj.response) {
                    aiResponse = JSON.parse(responseObj.response);
                }
                if (responseObj.error) {
                    html.setText(context.error, responseObj.error);
                } else {
                    console.log(JSON.stringify(aiResponse, null, 2));
                    if (aiResponse.ok) {
                        diagram = generateDrakonFromAiAst(aiResponse.algorithm);
                        widgets.removeQuestions();
                        context.onGenerated(diagram);
                    } else {
                        html.setText(context.error, aiResponse.error);
                    }
                }
            } else {
                if (_selectValue_2 === 'claude') {
                    showWait();
                    if (fakeai) {
                        responseObj = generateFakeAiResponse();
                    } else {
                        responseObj = await sendRequestToClaude(ai.key, ai.model, prompt, userRequest);
                    }
                    hideWait();
                    if (responseObj.response) {
                        aiResponse = JSON.parse(removeFirstAndLastLines(responseObj.response));
                    }
                } else {
                    html.setText(context.error, 'This AI provider is not supported');
                }
            }
        }
    } catch (_handlerData_) {
        ex = _handlerData_;
        html.setText(context.error, ex.message);
    }
}
function hello(title) {
    return title + ', ' + name;
}
module.exports = { hello };