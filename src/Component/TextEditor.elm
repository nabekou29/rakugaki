module Component.TextEditor exposing (textEditor)

import Html exposing (Attribute, Html, node)


textEditor : List (Attribute msg) -> Html msg
textEditor attrs =
    node "my-text-editor"
        attrs
        []
