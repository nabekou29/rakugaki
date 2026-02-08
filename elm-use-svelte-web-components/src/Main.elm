module Main exposing (main)

import Browser
import Component.Counter exposing (counter)
import Component.RichTextEditor exposing (onUpdate, richTextEditor)
import Component.TextEditor exposing (textEditor)
import Html exposing (Html, div, text)
import Html.Attributes exposing (style, value)
import Html.Events exposing (onInput)
import SyntaxHighlight exposing (oneDark, toBlockHtml, useTheme, xml)


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


type alias Model =
    { text : String
    }


type alias Flags =
    ()


init : Flags -> ( Model, Cmd Msg )
init _ =
    ( { text = "Initial text" }, Cmd.none )


type Msg
    = ChangeText String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangeText text ->
            ( { model | text = text }, Cmd.none )


view : Model -> Html Msg
view model =
    div []
        [ div [] [ counter ]
        , div [ style "height" "20px" ] []
        , div [] [ textEditor [ value model.text, onInput ChangeText ] ]
        , div [ style "height" "20px" ] []
        , div [] [ richTextEditor [ value model.text, onUpdate ChangeText ] ]
        , div [ style "height" "20px" ] []
        , viewText model
        ]


viewText : Model -> Html msg
viewText model =
    div []
        [ useTheme oneDark
        , xml model.text
            |> Result.map (toBlockHtml (Just 1))
            |> Result.withDefault (div [] [])
        ]


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
