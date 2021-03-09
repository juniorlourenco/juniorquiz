import React from 'react';
import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackGround from '../src/components/QuizBackGround';
import QuizContainer from '../src/components/QuizContainer';
import Button from '../src/components/Button';

function ResultWidget ({ results }) {
    return (
        <Widget>
            <Widget.Header>
                Tela de Resultado:
            </Widget.Header>

            <Widget.Content>
                <p>
                    Você acertou
                    {' '}
                    {/* {results.reduce((somatoriaAtual, resultAtual) => {
                        const isAcerto = resultAtual === true;
                        if(isAcerto) {
                            return somatoriaAtual + 1;
                        }
                        return somatoriaAtual;
                    }, 0)} */}
                    {results.filter((x)=> x).length}
                    {' '}
                    perguntas
                    </p>
                <ul>
                    {results.map((result, index)=> (
                    <li key={`result__${result}`}>
                        # 
                        {index + 1} 
                        {' '}
                        Resultado: 
                        {result === true ? 'Acertou' : 'Errou'}
                    </li>
                    ))}
                </ul>
            </Widget.Content>
        </Widget>
    )
}

function LoadingWidget () {
    return (
        <Widget>
            <Widget.Header>
                Carregando...
            </Widget.Header>

            <Widget.Content>
                [Desafio do Loading]
            </Widget.Content>
        </Widget>
    )
}

function QuestionWidget({ 
    question, 
    totalQuestions,
    questionIndex, 
    onSubmit,
    addResult,
}) {
    const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
    const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
    const questionId = `question__${questionIndex}`;
    const isCorrect = selectedAlternative === question.answer;
    const hasAlternativeSelected = selectedAlternative !== undefined;

    return (
        <Widget>
        <Widget.Header>
            {/* <BackLinkArrow href="/" /> */}
            <h3>
                {`Pergunta ${questionIndex +1} de ${totalQuestions}`}
            </h3>
        </Widget.Header>

        <img
            alt="Descrição"
            style={{
                width: '100%',
                height: '150px',
                objectFit: 'cover',
            }}
            src={question.image}
        />
        <Widget.Content>
            <h2>
                {question.title}
            </h2>
            <p>
                {question.description}
            </p>

            <form 
                onSubmit={(infosDoEvento) => {
                    infosDoEvento.preventDefault();
                    setIsQuestionSubmited(true);
                    setTimeout(() => {
                        addResult(isCorrect);
                        onSubmit();
                        setIsQuestionSubmited(false);
                        setSelectedAlternative(undefined);  
                    }, 3* 1000);
                }}
            >
                {question.alternatives.map((alternative, alternativeIndex) => {
                    const alternativeId = `alternative__${alternativeIndex}`;
                    return(
                    <Widget.Topic
                        as="label"
                        key={alternativeId}
                        htmlFor={alternativeId}
                    >
                        <input
                            //style={{ display: 'none' }}
                            id={alternativeId}
                            name={questionId}
                            onChange={() => setSelectedAlternative(alternativeIndex)}
                            type="radio"
                        />
                        {alternative}
                    </Widget.Topic>
                    )
                })}
            <Button type="submit" disabled={!hasAlternativeSelected}>
                Confirmar
            </Button>
            </form>
            {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
            {isQuestionSubmited && !isCorrect && <p>Você errou!</p>}
        </Widget.Content>
    </Widget>
    );
}

const screenStates = {
    QUIZ: 'QUIZ',
    LOADING: 'LOADING',
    RESULT: 'RESULT',
};

export default function QuizPage() {
    const [screenState, setScreenState] = React.useState(screenStates.LOADING);
    const [results, setResults] = React.useState([]);
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const totalQuestions = db.questions.length;
    const questionIndex = currentQuestion;
    const question = db.questions[questionIndex];

    function addResult() {
        setResults([
            ...results,
            result,
        ]);
    }

    // React Effects
    //componente nasce === didMount
    //componente atualiza === willUpdate
    //componente morre === willUnmount

    React.useEffect(() => {
        //fetch() ...
        setTimeout(() => {
            setScreenState(screenStates.QUIZ);
        }, 1* 1000)
    }, []);

    function handleSubmitQuiz () {
        const nextQuestion = questionIndex + 1;
        if (nextQuestion < totalQuestions) {
            setCurrentQuestion(nextQuestion);
        } else {setScreenState(screenStates.RESULT);
        }
    };

    return (
        <QuizBackGround backgroundImage={db.bg}>
            <QuizContainer>
                <QuizLogo />
                {screenState === screenStates.QUIZ && (
                    <QuestionWidget 
                        question={question}
                        questionIndex={questionIndex}
                        totalQuestions={totalQuestions}
                        onSubmit={handleSubmitQuiz}
                        addResult={addResult}
                    />
                )}

                {screenState === screenStates.LOADING && <LoadingWidget />}  

                {screenState === screenStates.RESULT && <ResultWidget result={result} />} 
            </QuizContainer>
        </QuizBackGround>
    );
}