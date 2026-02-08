module Component.RichTextEditor exposing (onUpdate, richTextEditor)

import Html exposing (Attribute, Html, node)
import Html.Events exposing (stopPropagationOn)
import Json.Decode as Json


onUpdate : (String -> msg) -> Attribute msg
onUpdate tagger =
    stopPropagationOn "updated" (Json.map alwaysStop (Json.map tagger targetValue))


targetValue : Json.Decoder String
targetValue =
    Json.at [ "detail", "target", "value" ] Json.string


alwaysStop : a -> ( a, Bool )
alwaysStop x =
    ( x, True )


richTextEditor : List (Attribute msg) -> Html msg
richTextEditor attrs =
    node "my-rich-text-editor"
        attrs
        []
