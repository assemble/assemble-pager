{{#pager}}
<!-- block -->
<a href="{{prev}}"{{ifFirst (attr class="disabled")}}>Prev</a>
<a href="{{next}}"{{ifLast (attr class="disabled")}}>Next</a>
{{/pager}}

<!-- relative -->
<a href="{{#if pager.prev}}{{relative pager.current pager.prev}}{{else}}#{{/if}}"{{#if pager.isFirst}} class="disabled"{{/if}}>Prev</a>
<a href="{{#if pager.next}}{{relative pager.current pager.next}}{{else}}#{{/if}}"{{#if pager.isLast}} class="disabled"{{/if}}>Next</a>

<!-- prev/next -->
<a href="{{prev pager}}"{{ifFirst pager (attr class="disabled")}}>Prev</a>
<a href="{{next pager}}"{{ifLast pager (attr class="disabled")}}>Next</a>

<!-- prev/next partials -->
{{> prev }}
{{> next }}


<!-- pager partial -->
{{> pager }}

